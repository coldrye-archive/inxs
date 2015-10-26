// vim: expandtab:ts=4:sw=4
/*
 * Copyright 2015 Carsten Klein
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


import * as sprintf from 'sprintf-js';

import {AbstractInjector} from 'inxs-common';
import InjectionError from 'inxs-common/lib/exceptions';
import {className} from 'inxs-common/lib/util';

import * as messages from './messages';


/**
 * Returns a logger that was configured so that all required methods become
 * available.
 *
 * @protected
 * @param {AbstractBroker} broker - the broker
 * @returns {AbstractLogger} the effective logger
 */
export function determineLogger(broker)
{
    let brokerLogger = broker && broker.logger;
    let result = brokerLogger ||
                 /* istanbul ignore next */ console ||
                 /* istanbul ignore next */ {};

    /*
     * Add missing required methods.
     */
    /*eslint brace-style: 0*/
    /*istanbul ignore next*/
    const defaultLog = result.info || function dummyLog() {};
    /*istanbul ignore next*/
    const warnLog = result.warn || defaultLog;

    if (!brokerLogger)
    {
        warnLog(messages.MSG_BROKER_SHOULD_HAVE_LOGGER);
    }

    const EXPECTED_LOGGER_METHODS = ['log', 'debug', 'info', 'warn', 'error'];
    for (const key of EXPECTED_LOGGER_METHODS)
    {
        if (!result.hasOwnProperty(key))
        {
            warnLog(sprintf.sprintf(messages.MSG_MISSING_LOGGER_METHOD, key));

            // no need to bind here
            result[key] = defaultLog;
        }
    }

    return result;
}


/**
 * Helper function for injector message logging.
 *
 * @protected
 * @param {string} message - the log messsage
 * @param {TargetType} target - the target object or function
 * @param {string} attr - the target's attribute
 * @param {Array<InterfaceType>} ifaces - the interfaces to inject
 * @param {function(message: string, data: *)} logMethod - the log method
 * (info, debug, error or warn)
 * @returns {void}
 */
/*istanbul ignore next*/
export function log(message, target, attr, ifaces, logMethod)
{
    logMethod(
        message,
        {
            target : className(target),
            attr : attr,
            interfaces : ifaces
        }
    );
}


/**
 * Make sure the broker supports the required features and warn about
 * missing features.
 *
 * @protected
 * @param {AbstractBroker} broker - the broker
 * @param {AbstractLogger} logger - the logger
 * @throws {TypeError} in case the broker is missing required functionality
 * @returns {void}
 */
export function validateBroker(broker, logger)
{
    if (!broker || typeof broker != 'object')
    {
        throw new TypeError(messages.MSG_BROKER_MUST_BE_OBJECT);
    }

    if (typeof broker.getInstance != 'function' ||
        broker.getInstance.length != 1)
    {
        throw new TypeError(messages.MSG_BROKER_MUST_IMPL_GET_INSTANCE);
    }

    if (typeof broker.validateInterfaces != 'function' ||
        broker.validateInterfaces.length != 0)
    {
        logger.warn(
            messages.MSG_BROKER_SHOULD_IMPL_VALIDATE_INTERFACES,
            {broker : className(broker)}
        );
    }
}


/**
 * Determine the actual suite of injectors.
 *
 * @protected
 * @param {Array<AbstractInjector>} defaultInjectors - the default injector suite
 * @param {Array<AbstractInjector>} customInjectors? - the custom injectors
 * @param {AbstractLogger} logger - the logger
 * @throws {InjectionError} in case that there are no valid custom injectors
 * @returns {Array<AbstractInjector>} the injectors
 */
export function determineActualInjectors(
    defaultInjectors, customInjectors, logger
)
{
    let result = [];
    let injectorsChosen = customInjectors ? customInjectors : defaultInjectors;

    /*istanbul ignore else*/
    if (injectorsChosen)
    {
        result = [];

        for (const injector of injectorsChosen)
        {
            if (injector instanceof AbstractInjector)
            {
                result.push(injector);
            }
            else
            {
                const injectorName =
                    injector ? className(injector) : 'null|undefined'
                logger.warn(
                    messages.MSG_INVALID_INJECTOR,
                    {
                        injector : injectorName
                    }
                );
            }
        }
    }

    if (result.length == 0)
    {
        throw new InjectionError(messages.MSG_MISSING_INJECTORS);
    }

    return result;
}


/**
 * Validate the interfaces by delegating to the broker.
 *
 * @protected
 * @param {AbstractBroker} broker - the broker
 * @param {AbstractLogger} logger - the logger
 * @param {Array<InterfaceType>} ifaces - the interfaces
 * @returns {void}
 */
export function validateInterfaces(broker, logger, ifaces)
{
    /*istanbul ignore else*/
    if (ifaces.length == 0)
    {
        throw new InjectionError(messages.MSG_IFACE_REQUIRED);
    }

    /*istanbul ignore else*/
    if (broker.validateInterfaces)
    {
        logger.debug(
            messages.MSG_VALIDATING_IFACES,
            {
                interfaces : ifaces
            }
        );

        try
        {
            broker.validateInterfaces(...ifaces);
        }
        catch (error)
        {
            logger.error(
                messages.MSG_INVALID_IFACE,
                {
                    cause : error
                }
            );

            throw new InjectionError(messages.MSG_INVALID_IFACE);
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
 * @param {AbstractLogger} logger - the logger
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
        log(
            messages.MSG_NO_INJECTORS_AVAIL,
            target, attr, null, logger.error
        );
        throw new InjectionError(messages.MSG_NO_INJECTORS_AVAIL);
    }

    for (const injector of injectors)
    {
        if (injector.canInject(target, attr, descriptor))
        {
            result = injector;
            break;
        }
    }

    if (!result)
    {
        log(
            messages.MSG_UNSUPPORTED_INJECTION_METHOD,
            target, attr, null, logger.error
        );

        throw new InjectionError(messages.MSG_UNSUPPORTED_INJECTION_METHOD);
    }

    return result;
}

