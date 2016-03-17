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


/**
 * @typedef {function(iface: InterfaceType): InjectionDecoratorImplType} InjectionDecoratorType
 */


/**
 * TODO:external inxs-common
 * @typedef {Object} BrokerType
 * @property {function(iface: InterfaceType): Object} getInstance
 * @property {LoggerType} [logger]
 * @property {function(ifaces: Array<InterfaceType>): boolean} [validateInterfaces]
 */


/**
 * TODO:external inxs-common
 * @typedef {Object} LoggerType
 * @property {function(message: string, data: *): void} info
 * @property {function(message: string, data: *): void} warn
 * @property {function(message: string, data: *): void} debug
 * @property {function(message: string, data: *): void} error
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

