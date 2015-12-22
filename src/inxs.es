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


import InjectionError from 'inxs-common/exceptions';

import {injectors as defaultInjectors} from './impl';
import * as messages from './messages';
import * as util from './util';


/**
 * The module inxs provides a decorator used for injecting instances into either
 * both static or instance level methods and properties.
 *
 * The module must be called with a broker object that is expected to have the
 * following methods
 *
 * - getInstance(iface : {String|Function}) : {Object},
 *
 * Optionally, the broker might implement the following methods and properties
 *
 * - validateInterfaces(...ifaces : {String|Function}) : {Boolean}, and
 * - get logger() : {Object<AbstractLogger>}.
 *
 * The broker is responsible for both resolving the interfaces passed to it and
 * providing suitable instances for these interfaces.
 *
 * You may further customize the injection decorator by providing an alternate
 * suite of injectors.
 *
 * Usage:
 *
 * ```
 * import inxs from 'inxs';
 * import MyBroker from './mybroker';
 * export const inject = inxs(new MyBroker());
 * ```
 *
 * @param {Object<AbstractBroker>} broker - the broker
 * @param {Array<AbstractInjector>} [customInjectors] - custom suite of injectors
 * to be used instead of the default suite
 * @returns {InjectionDecoratorType} - the injection decorator
 */
export default function inxs(broker, customInjectors)
{
    const logger = util.determineLogger(broker);
    util.validateBroker(broker, logger);
    const injectors = util.determineActualInjectors(
        defaultInjectors, {customInjectors: customInjectors, logger: logger}
    );

    return function injectionDecoratorWrapper(...ifaces)
    {
        util.validateInterfaces(broker, logger, ifaces);

        return function injectionDecorator(...args)
        {
            /* sistanbul ignore next */
            let target = args[0];

            // we do not support constructor injection
            if (args.length == 1)
            {
                util.log(
                    messages.MSG_USE_PROPERTY_INJECTION_INSTEAD,
                    target, null, ifaces, logger.error
                );

                throw new InjectionError(
                    messages.MSG_USE_PROPERTY_INJECTION_INSTEAD
                );
            }

            /* sistanbul ignore next */
            const attr = args[1];
            /* sistanbul ignore next */
            const descriptor = args[2];
            const injector = util.determineInjector(
                target, attr, descriptor, logger, injectors
            );

            return injector.inject(
                target, attr, descriptor, ifaces, {broker:broker, logger:logger}
            );
        }
    }
}


/**
 * @typedef {Object} AbstractBroker
 * @property {function(iface: InterfaceType): Object} getInstance
 * @property {AbstractLogger} [logger]
 * @property {function(ifaces: Array<InterfaceType>): boolean} [validateInterfaces]
 */


/**
 * @typedef {function(iface: InterfaceType): InjectionDecoratorImplType} InjectionDecoratorType
 */


/**
 * @typedef {Object} AbstractLogger
 * @property {function(message: string, data: *): void} info
 * @property {function(message: string, data: *): void} warn
 * @property {function(message: string, data: *): void} debug
 * @property {function(message: string, data: *): void} error
 */


/**
 * @protected
 * @typedef {Object} InjectorOptions
 * @property {AbstractBroker} broker
 * @property {AbstractLogger} logger
 */


/**
 * @protected
 * @typedef {function(target: TargetType, attr: string, descriptor: DescriptorType): DescriptorType} InjectionDecoratorImplType
 */


/**
 * @protected
 * @external {AbstractInjector} /projects/inxs-common/doc/dev/class/src/inxs-common.es~AbstractInjector.html
 */


/**
 * @protected
 * @external {DescriptorType} /projects/inxs-common/doc/dev/typedef/index.html#static-typedef-DescriptorType.html
 */


/**
 * @protected
 * @external {MethodDescriptorType} /projects/inxs-common/doc/dev/typedef/index.html#static-typedef-MethodDescriptorType
 */


/**
 * @protected
 * @external {PropertyDescriptorType} /projects/inxs-common/doc/dev/typedef/index.html#static-typedef-PropertyDescriptorType
 */


/**
 * @external {InterfaceType} /projects/inxs-common/doc/dev/typedef/index.html#static-typedef-InterfaceType.html
 */


/**
 * @protected
 * @external {TargetType} /projects/inxs-common/doc/dev/typedef/index.html#static-typedef-TargetType.html
 */

