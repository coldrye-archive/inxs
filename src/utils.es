// vim: expandtab:ts=4:sw=4
/*
 * Copyright 2015-2016 Carsten Klein
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import {AbstractInjector} from 'inxs-common/injectors';
import InjectionError from 'inxs-common/exceptions';
import {className} from 'pingo-common/utils';


/**
 * Returns a logger that was configured so that all required methods become
 * available.
 *
 * @protected
 * @param {BrokerType} broker - the broker
 * @returns {LoggerType} - the effective logger
 */
export function determineLogger(broker)
{
    let brokerLogger = broker && broker.logger;
    /*
     * Note: istanbul will generate a weird coverage report
     * if we use the ternary operator ?: or a || cascade here
     */
    let result = brokerLogger;
    if (!result && console)
    {
        result = console;
    }
    else
    {
        result = {};
    }

    /*
     * add missing required methods
     */
    function dummyLog()
    {}

    const defaultLog =
        result.info ? result.info.bind(result) : dummyLog.bind(result);
    const warnLog = result.warn ? result.warn.bind(result) : defaultLog;

    if (!brokerLogger)
    {
        warnLog('broker should have a logger property');
    }

    const EXPECTED_LOGGER_METHODS = ['debug', 'info', 'warn', 'error'];
    for (const key of EXPECTED_LOGGER_METHODS)
    {
        if (!result.hasOwnProperty(key))
        {
            warnLog(`logger is missing method "${key}", adding default`);
            // no need to bind here
            result[key] = defaultLog;
        }
    }

    return result;
}


/**
 * Make sure the broker supports the required features and warn about
 * missing features.
 *
 * @protected
 * @param {BrokerType} broker - the broker
 * @param {LoggerType} logger - the logger
 * @throws {TypeError} - in case the broker is missing required functionality
 * @returns {void}
 */
export function validateBroker(broker, logger)
{
    if (typeof broker != 'object' || !broker)
    {
        logger.error('broker must be an object');
        throw new TypeError('broker must be an object');
    }

    if (typeof broker.getInstance != 'function'
        || broker.getInstance.length != 1)
    {
        logger.error(
            'broker must implement getInstance(iface : InterfaceType) : Object',
            {broker:className(broker)}
        );
        throw new TypeError(
            'broker must implement getInstance(iface : InterfaceType) : Object',
            {data:{broker:className(broker)}}
        );
    }

    if (typeof broker.validateInterfaces != 'function'
        || broker.validateInterfaces.length != 0)
    {
        logger.warn(
            'broker should implement validateInterfaces(ifaces : '
            + 'Array<InterfaceType>) : boolean',
            {broker:className(broker)}
        );
    }
}


/**
 * Determine the actual suite of injectors.
 *
 * @protected
 * @param {Array<AbstractInjector>} defaultInjectors - the default injector suite
 * @param {LoggerType} logger - the logger
 * @param {Array<AbstractInjector>} customInjectors - the optional custom injectors
 * @throws {InjectionError} - in case that there are no valid [custom] injectors
 * @returns {Array<AbstractInjector>} - the injectors
 */
export function determineActualInjectors(
    defaultInjectors, logger, customInjectors
)
{
    let result = [];
    let injectorsChosen = customInjectors ? customInjectors : defaultInjectors;

    /*istanbul ignore else*/
    if (injectorsChosen)
    {
        for (const injector of injectorsChosen)
        {
            if (injector instanceof AbstractInjector)
            {
                result.push(injector);
            }
            else
            {
                logger.warn(
                    'injector must be an instance of AbstractInjector',
                    {injector:className(injector)}
                );
            }
        }
    }

    if (result.length == 0)
    {
        logger.error('no injectors available for injection');
        throw new InjectionError('no injectors available for injection');
    }

    return result;
}


/**
 * Validate the interfaces by delegating to the broker.
 *
 * @protected
 * @param {BrokerType} broker - the broker
 * @param {LoggerType} logger - the logger
 * @param {Array<InterfaceType>} ifaces - the interfaces
 * @returns {void}
 */
export function validateInterfaces(broker, logger, ifaces)
{
    /*istanbul ignore else*/
    if (ifaces.length == 0)
    {
        // TODO:requires addition info for the user: target, attr
        logger.error('no interfaces specified for injection');
        throw new InjectionError('no interfaces specified for injection');
    }

    /*istanbul ignore else*/
    if (broker.validateInterfaces)
    {
        try
        {
            logger.debug(
                `validating interfaces using broker "${className(broker)}"`,
                {interfaces:ifaces}
            );
            broker.validateInterfaces(...ifaces);
        }
        catch (error)
        {
            logger.error('invalid interface', {cause:error});
            throw new InjectionError('invalid interface', {cause:error});
        }
    }
}


/**
 * Determines the injector capable of handling the injection.
 *
 * @protected
 * @param {TargetType} target - the injection target
 * @param {string} attr - the injected attribute
 * @param {DescriptorType} descriptor - the descriptor
 * @param {LoggerType} logger - the logger
 * @param {Array<AbstractInjector>} injectors - the injectors
 * @throws {InjectionError}
 * @returns {AbstractInjector} the injector
 */
export function determineInjector(
    target, attr, descriptor, logger, injectors
)
{
    let result;

    if (!Array.isArray(injectors) || injectors.length == 0)
    {
        logger.error('no injectors available for injection', {target, attr});
        throw new InjectionError(
            'no injectors available for injection',
            {data:{target:attr}}
        );
    }

    for (let index=0, length=injectors.length; index<length; index++)
    {
        const injector = injectors[index];
        if (injector.canInject(target, attr, descriptor))
        {
            result = injector;
            break;
        }
    }

    if (!result)
    {
        logger.error('unsupported injection method',{target,attr});
        throw new InjectionError(
            'unsupported injection method',
            {data:{target:attr}}
        );
    }

    return result;
}

