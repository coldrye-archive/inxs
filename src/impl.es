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


import * as common from 'inxs-common';
import * as assertions from 'inxs-common/lib/assertions';

import * as messages from './messages';
import * as util from './util';


/**
 * The class StaticPropertyInjectorImpl is responsible for handling static
 * property injections.
 *
 * @private
 * @extends AbstractStaticPropertyInjector
 */
export class StaticPropertyInjectorImpl
extends common.AbstractStaticPropertyInjector
{
    /**
     * @override
     */
    inject(target, attr, descriptor, ifaces, options)
    {
        return propertyInjector(target, attr, descriptor, ifaces, options);
    }
}


/**
 * The class StaticPropertyInjectorImpl is responsible for handling instance
 * property injections.
 *
 * @private
 * @extends AbstractInstancePropertyInjector
 */
export class InstancePropertyInjectorImpl
extends common.AbstractInstancePropertyInjector
{
    /**
     * @override
     */
    inject(target, attr, descriptor, ifaces, options)
    {
        return propertyInjector(target, attr, descriptor, ifaces, options);
    }
}


/**
 * The class StaticMethodInjectorImpl is responsible for handling static
 * method parameter injections.
 *
 * @private
 * @extends AbstractStaticMethodInjector
 */
export class StaticMethodInjectorImpl
extends common.AbstractStaticMethodInjector
{
    /**
     * @override
     */
    inject(target, attr, descriptor, ifaces, options)
    {
        return methodInjector(target, attr, descriptor, ifaces, options);
    }
}


/**
 * The class InstanceMethodInjectorImpl is responsible for handling instance
 * method parameter injections.
 *
 * @private
 * @extends AbstractInstanceMethodInjector
 */
export class InstanceMethodInjectorImpl
extends common.AbstractInstanceMethodInjector
{
    /**
     * @override
     */
    inject(target, attr, descriptor, ifaces, options)
    {
        return methodInjector(target, attr, descriptor, ifaces, options);
    }
}


/**
 * @private
 * @param {TargetType} target - the target object or function
 * @param {string} attr - the target's attribute
 * @param {PropertyDescriptorType} descriptor - the descriptor
 * @param {Array<InterfaceType>} ifaces - the interfaces to inject
 * @param {InjectorOptions} options - logger and broker
 * @throws {InjectionError}
 * @returns {PropertyDescriptorType} - the property descriptor
 */
export function propertyInjector(target, attr, descriptor, ifaces, options)
{
    assertions.assertSingleInterfaceOnly(target, attr, descriptor, ifaces);

    const broker = options.broker;
    const logger = options.logger;
    let iface = ifaces[0];

    util.log(
        messages.MSG_PREPARING_INJECTION_WRAPPER,
        target, attr, iface, logger.debug
    );

    descriptor.get = function propertyInjectionWrapper()
    {
        util.log(
            messages.MSG_INJECTING_INSTANCE,
            target, attr, iface, logger.debug
        );

        return broker.getInstance(iface);
    };

    return descriptor;
}


/**
 * @private
 * @param {TargetType} target - the target object or function
 * @param {string} attr - the target's attribute
 * @param {MethodDescriptorType} descriptor - the descriptor
 * @param {Array<InterfaceType>} ifaces - the interfaces to inject
 * @param {InjectorOptions} options - logger and broker
 * @throws {InjectionError}
 * @returns {MethodDescriptorType} the property descriptor
 */
export function methodInjector(target, attr, descriptor, ifaces, options)
{
    assertions.assertFormalParametersMatch(
        target, attr, descriptor, ifaces
    );

    const actualIfaces = [...ifaces];

    const broker = options.broker;
    const logger = options.logger;
    const method = descriptor.value;

    util.log(
        messages.MSG_PREPARING_INJECTION_WRAPPER,
        target, attr, actualIfaces, logger.debug
    );

    descriptor.value = function methodInjectionWrapper()
    {
        let args = [];
        for (const iface of actualIfaces)
        {
            util.log(
                messages.MSG_INJECTING_INSTANCE,
                target, attr, iface, logger.debug
            );

            const instance = broker.getInstance(iface);
            args.push(instance);
        }
        args = args.concat(Array.prototype.slice.call(arguments));

        return method.apply(this, args);
    };

    return descriptor;
}


/**
 * @private
 */
export const injectors = [
    new InstancePropertyInjectorImpl(),
    new InstanceMethodInjectorImpl(),
    new StaticMethodInjectorImpl(),
    new StaticPropertyInjectorImpl()
];

