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


/**
 * @protected
 * @type {string}
 */
export const MSG_BROKER_MUST_BE_OBJECT = 'broker must be an object';


/**
 * @protected
 * @type {string}
 */
export const MSG_BROKER_MUST_IMPL_GET_INSTANCE =
    'broker must implement getInstance(iface : {string|function}) : {Object}';


/**
 * @protected
 * @type {string}
 */
export const MSG_BROKER_SHOULD_IMPL_VALIDATE_INTERFACES =
    'broker should implement validateInterfaces(...ifaces : ' +
    '{Array<string|function>)} : {boolean}';


/**
 * @protected
 * @type {string}
 */
export const MSG_IFACE_REQUIRED =
    'must provide least one interface to be injected';


/**
 * @protected
 * @type {string}
 */
export const MSG_USE_PROPERTY_INJECTION_INSTEAD =
    'constructor injection not supported, use property injection instead';


/**
 * @protected
 * @type {string}
 */
export const MSG_UNSUPPORTED_INJECTION_METHOD = 'unsupported injection method';


/**
 * @protected
 * @type {string}
 */
export const MSG_VALIDATING_IFACES = 'validating interfaces';


/**
 * @protected
 * @type {string}
 */
export const MSG_INVALID_IFACE = 'invalid interface';


/**
 * @protected
 * @type {string}
 */
export const MSG_BROKER_SHOULD_HAVE_LOGGER =
    'broker should have a logger property';

/**
 * @protected
 * @type {string}
 */
export const MSG_MISSING_LOGGER_METHOD =
    'logger is missing method "%s", adding default';


/**
 * @protected
 * @type {string}
 */
export const MSG_INVALID_INJECTOR =
    'injector must be instance of AbstractInjector';


/**
 * @protected
 * @type {string}
 */
export const MSG_NO_INJECTORS_AVAIL =
    'there a no injectors available for injection';


/**
 * @protected
 * @type {string}
 */
export const MSG_PREPARING_INJECTION_WRAPPER = 'preparing injection wrapper';


/**
 * @protected
 * @type {string}
 */
export const MSG_INJECTING_INSTANCE = 'injecting instance';

