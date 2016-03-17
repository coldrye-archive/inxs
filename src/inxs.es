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


import {defaultInjectors} from './impl';
import * as utils from './utils';


/**
 * TODO:revise documentation
 * The module inxs provides a decorator used for injecting instances into either
 * both static or instance level methods and properties.
 *
 * Usage:
 *
 * ```
 * import inxs from 'inxs';
 * import MyBroker from './mybroker';
 * export const inject = inxs(new MyBroker());
 * ```
 *
 * @param {Object<BrokerType>} broker - the broker
 * @param {Array<AbstractInjector>} [customInjectors] - custom suite of injectors
 * to be used instead of the default suite
 * @returns {InjectionDecoratorType} - the injection decorator
 */
export default function inxs(broker, customInjectors)
{
    const logger = utils.determineLogger(broker);
    utils.validateBroker(broker, logger);
    const injectors = utils.determineActualInjectors(
        defaultInjectors, logger, customInjectors
    );

    return function injectionDecoratorWrapper(...ifaces)
    {
        // TODO:validating here might be too early as ifaces might not have been registered yet
        // TODO:should be postponed to until actual injection
        // THINK:obsolete?
        utils.validateInterfaces(broker, logger, ifaces);

        return function injectionDecorator(target, attr, descriptor)
        {
            const injector = utils.determineInjector(
                target, attr, descriptor, logger, injectors
            );

            return injector.inject(
                {target, attr, descriptor, ifaces}, broker, logger
            );
        }
    }
}

