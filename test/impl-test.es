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


import assert from 'esaver';

import InjectionError from 'inxs-common/exceptions';

import * as impl from '../src/impl';
import * as messages from '../src/messages';

import * as fixtures from './fixtures';


describe('impl.methodInjector',
function ()
{
    it('make sure that assertFormalParametersMatch is in place',
    function ()
    {
        assert.expect(1);
        assert.throws(
        function ()
        {
            impl.methodInjector(
                fixtures.injectionTarget, fixtures.attr,
                fixtures.methodDescriptorWithParams,
                ['iface1', 'iface2', 'iface3'],
                {
                    broker : fixtures.simpleBroker,
                    logger : fixtures.dummyLogger
                }
            );
        }, InjectionError);
    });

    it('must return the required injection wrapper',
    function ()
    {
        assert.expect(3);
        const origdebug = fixtures.dummyLogger.debug;
        fixtures.dummyLogger.debug = function (msg) {
            assert.equal(msg, messages.MSG_PREPARING_INJECTION_WRAPPER);
        }
        const descriptor = impl.methodInjector(
            fixtures.injectionTarget, fixtures.attr,
            fixtures.methodDescriptorWithParams,
            ['iface1', 'iface2'],
            {
                broker : fixtures.simpleBroker,
                logger : fixtures.dummyLogger
            }
        );
        assert.ok(typeof descriptor.value == 'function');
        assert.equal(descriptor.value.name, 'methodInjectionWrapper');
        fixtures.dummyLogger.debug = origdebug;
    });
});


describe('impl.propertyInjector',
function ()
{
    it('make sure that assertSingleInterfaceOnly is in place',
    function ()
    {
        assert.expect(1);
        assert.throws(
        function ()
        {
            impl.propertyInjector(
                fixtures.injectionTarget, fixtures.attr,
                fixtures.propertyDescriptor,
                ['iface1', 'iface2'],
                {
                    broker : fixtures.simpleBroker,
                    logger : fixtures.dummyLogger
                }
            );
        }, InjectionError);
    });

    it('must return the required injection wrapper',
    function ()
    {
        assert.expect(3);
        const origdebug = fixtures.dummyLogger.debug;
        fixtures.dummyLogger.debug = function (msg) {
            assert.equal(msg, messages.MSG_PREPARING_INJECTION_WRAPPER);
        }
        const descriptor = impl.propertyInjector(
            fixtures.injectionTarget, fixtures.attr,
            fixtures.propertyDescriptor,
            ['iface1'],
            {
                broker : fixtures.simpleBroker,
                logger : fixtures.dummyLogger
            }
        );
        assert.ok(typeof descriptor.get == 'function');
        assert.equal(descriptor.get.name, 'propertyInjectionWrapper');
        fixtures.dummyLogger.debug = origdebug;
    });
});


describe('impl.injectors',
function ()
{
    it('must consist of expected injectors in exact order',
    function ()
    {
        assert.expect(1);
        assert.deepEqual(
            impl.injectors,
            [
                new impl.InstancePropertyInjectorImpl(),
                new impl.InstanceMethodInjectorImpl(),
                new impl.StaticMethodInjectorImpl(),
                new impl.StaticPropertyInjectorImpl()
            ]
        );
    });
});

