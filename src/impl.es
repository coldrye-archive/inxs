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


import
{
    decoratedClassFactory, decoratedMethodFactory
}
from 'pingo-common/factories';

import * as injectors from 'inxs-common/injectors';
import * as assertions from 'inxs-common/assertions';


/**
 * The class ConstructorInjectorImpl is responsible for handling constructor
 * parameter injections.
 *
 * @private
 */
export class ConstructorInjectorImpl
extends injectors.AbstractConstructorInjector
{
    /**
     * @override
     */
    inject(injectionDescriptor, broker, logger)
    {
        const {target, ifaces} = {...injectionDescriptor};

        logger.debug(
            'preparing constructor injection wrapper',
            {target, interfaces:ifaces}
        );

        const injector = function injectionWrapper(target, args)
        {
            const actualArgs = injectIntoArguments(
                injectionDescriptor, args, broker, logger
            );

            target.apply(this, actualArgs);
        };

        return decoratedClassFactory(target, injector);
    }
}


/**
 * The class StaticPropertyInjectorImpl is responsible for handling static
 * property injections.
 *
 * @private
 */
export class StaticPropertyInjectorImpl
extends injectors.AbstractStaticPropertyInjector
{
    /**
     * @override
     */
    inject(injectionDescriptor, broker, logger)
    {
        return propertyInjector(injectionDescriptor, broker, logger);
    }
}


/**
 * The class StaticPropertyInjectorImpl is responsible for handling instance
 * property injections.
 *
 * @private
 */
export class InstancePropertyInjectorImpl
extends injectors.AbstractInstancePropertyInjector
{
    /**
     * @override
     */
    inject(injectionDescriptor, broker, logger)
    {
        return propertyInjector(injectionDescriptor, broker, logger);
    }
}


/**
 * The class StaticMethodInjectorImpl is responsible for handling static
 * method parameter injections.
 *
 * @private
 */
export class StaticMethodInjectorImpl
extends injectors.AbstractStaticMethodInjector
{
    /**
     * @override
     */
    inject(injectionDescriptor, broker, logger)
    {
        return methodInjector(injectionDescriptor, broker, logger);
    }
}


/**
 * The class InstanceMethodInjectorImpl is responsible for handling instance
 * method parameter injections.
 *
 * @private
 */
export class InstanceMethodInjectorImpl
extends injectors.AbstractInstanceMethodInjector
{
    /**
     * @override
     */
    inject(injectionDescriptor, broker, logger)
    {
        return methodInjector(injectionDescriptor, broker, logger);
    }
}


/**
 * @private
 * @param {InjectionDescriptor} injectionDescriptor - the injection descriptor
 * @param {BrokerType} broker - the broker
 * @param {LoggerType} logger - the logger
 * @throws {InjectionError}
 * @returns {PropertyDescriptorType} - the property descriptor
 */
export function propertyInjector(injectionDescriptor, broker, logger)
{
    assertions.assertSingleInterfaceOnly(injectionDescriptor);

    const {target, attr, descriptor, ifaces} = {...injectionDescriptor};

    let iface = ifaces[0];

    logger.debug(
        'preparing property injection wrapper',
        {target, attr, interface:iface}
    );

    // FIXME:must remove setter
    // FIXME:pingo-injectors must provide for a decorated method factory
    descriptor.get = function propertyInjectionWrapper()
    {
        logger.debug(
            'injecting interface',
            {target, attr, interface:iface}
        );

        // FIXME:must throw injection error in case of broker error or null instance
        return broker.getInstance(iface);
    };

    return descriptor;
}


/**
 * @private
 * @param {InjectionDescriptor} injectionDescriptor - the injection descriptor
 * @param {BrokerType} broker - the broker
 * @param {LoggerType} logger - the logger
 * @throws {InjectionError}
 * @returns {MethodDescriptorType} - the method descriptor
 */
export function methodInjector(injectionDescriptor, broker, logger)
{
    assertions.assertFormalParametersMatch(injectionDescriptor);

    const {target, attr, descriptor, ifaces} = {...injectionDescriptor};

    logger.debug(
        'preparing method injection wrapper',
        {target, attr, interfaces:ifaces}
    );

    const method = descriptor.value;

    // TODO:get rid of dangling references: target
    const injector = function injectionWrapper(method, args)
    {
// TODO:get rid of dangling references: injectionDescriptor
        const actualArgs = injectIntoArguments(
            injectionDescriptor, args, broker, logger
        );

        /*eslint no-invalid-this:0*/
        return method.apply(this, actualArgs);
    };

    descriptor.value = decoratedMethodFactory(method, injector);

    return descriptor;
}


/**
 * @private
 * @param {InjectionDescriptor} injectionDescriptor - the injection descriptor
 * @param {Array} args - the original arguments array
 * @param {BrokerType} broker - the broker
 * @param {LoggerType} logger - the logger
 * @throws {InjectionError}
 * @returns {*} - the return value of the decorated method
 */
// TODO:get rid of dangling references: injectionDescriptor
function injectIntoArguments({target, attr, ifaces}, args, broker, logger)
{
    let result = [];

    // TODO:get rid of dangling references: target
    for (let index=0, length=ifaces.length; index<length; index++)
    {
        const iface = ifaces[index];

        logger.debug(
            'injecting interface',
            {target, attr, interface:iface}
        );

        // FIXME:must throw injection error in case of broker error or null instance
        const instance = broker.getInstance(iface);
        result.push(instance);
    }

    return result.concat(Array.prototype.slice.call(args));
}


/**
 * @private
 */
export const defaultInjectors = [
    new ConstructorInjectorImpl(),
    new InstancePropertyInjectorImpl(),
    new InstanceMethodInjectorImpl(),
    new StaticMethodInjectorImpl(),
    new StaticPropertyInjectorImpl()
];

