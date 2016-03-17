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


class InvalidBroker
{
}

export const invalidBroker = new InvalidBroker();


class InvalidBrokerGetInstanceMissingParameters {
    getInstance()
    {}
}

export const invalidBrokerGetInstanceMissingParameters =
new InvalidBrokerGetInstanceMissingParameters();


class InvalidBrokerGetInstanceWithExtraneousParameters {

    /*eslint no-unused-vars:0*/
    getInstance(iface, extraneous)
    {}
}

export const invalidBrokwerGetInstanceWithExtraneousParameters =
new InvalidBrokerGetInstanceWithExtraneousParameters();


class SimpleBroker
{
    getInstance(iface)
    {
        return 'injected';
    }
}

export const simpleBroker = new SimpleBroker();


export const dummyLogger = {
    log : function () {},
    info : function () {},
    warn : function () {},
    error : function () {},
    debug : function () {}
};


class SimpleBrokerLogging extends SimpleBroker
{
    get logger()
    {
        return dummyLogger;
    }
}


export const simpleBrokerLogging = new SimpleBrokerLogging();


class SimpleBrokerValidating extends SimpleBrokerLogging
{
    validateInterfaces(...ifaces)
    {
        for (const iface of ifaces)
        {
            const ifaceType = typeof iface;
            if (['function', 'string', 'symbol'].indexOf(ifaceType) == -1)
            {
                throw TypeError('interface not available');
            }
        }
    }
}

export const simpleBrokerValidating = new SimpleBrokerValidating();


export class InjectionTarget
{}

export const injectionTarget = new InjectionTarget();


export const propertyDataDescriptor =
{
    configurable: true,
    enumerable: true,
    writable: true,
    value: 1
};


export const accessorPropertyDescriptor =
{
    configurable: true,
    enumerable: true,
    writable: true,
    get: function get() {}
};


export const methodDescriptor =
{
    configurable: true,
    enumerable: true,
    writable: true,
    value : function method() {}
};


export const methodDescriptorWithParams =
{
    configurable: true,
    enumerable: true,
    writable: true,
    value : function method(arg1, arg2) {}
};


export const attr = 'attr';

