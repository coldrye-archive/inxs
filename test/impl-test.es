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


import InjectionError from 'inxs-common/exceptions';

import * as impl from '../src/impl';

import * as fixtures from './fixtures';


describe('methodInjector()',
function ()
{
    it('must assert that formal parameters match',
    function ()
    {
        function tc()
        {
            impl.methodInjector(
            {
                target:fixtures.injectionTarget, attr:fixtures.attr,
                descriptor:fixtures.methodDescriptorWithParams,
                ifaces:['iface1', 'iface2', 'iface3']
            }, fixtures.simpleBroker, fixtures.dummyLogger
            );
        }
        tc.should.throw(
            InjectionError, 'unable to inject more interfaces than'
        );
    });

    it('must return the expected injection wrapper',
    function ()
    {
        const origdebug = fixtures.dummyLogger.debug;
        fixtures.dummyLogger.debug = function (msg) {
            msg.should.contain('preparing method injection wrapper');
        }
        const descriptor = impl.methodInjector(
        {
            target:fixtures.injectionTarget, attr:fixtures.attr,
            descriptor:fixtures.methodDescriptorWithParams,
            ifaces:['iface1', 'iface2']
        }, fixtures.simpleBroker, fixtures.dummyLogger
        );
        descriptor.value.should.be.a.function;
        descriptor.value.name.should.equal('method');
        fixtures.dummyLogger.debug = origdebug;
    });
});


describe('propertyInjector()',
function ()
{
    it('must assert single interface only',
    function ()
    {
        function tc()
        {
            impl.propertyInjector(
            {
                target:fixtures.injectionTarget, attr:fixtures.attr,
                descriptor:fixtures.propertyDataDescriptor,
                ifaces:['iface1', 'iface2']
            }, fixtures.simpleBroker, fixtures.dummyLogger
            );
        }
        tc.should.throw(InjectionError, 'single interface expected');
    });

    it('must return the required injection wrapper',
    function ()
    {
        const origdebug = fixtures.dummyLogger.debug;
        fixtures.dummyLogger.debug = function (msg) {
            msg.should.contain('preparing property injection wrapper');
        }
        const descriptor = impl.propertyInjector(
        {
            target:fixtures.injectionTarget, attr:fixtures.attr,
            descriptor:fixtures.propertyDataDescriptor,
            ifaces:['iface1']
        }, fixtures.simpleBroker, fixtures.dummyLogger
        );
        descriptor.get.should.be.a.function;
        descriptor.get.name.should.equal('propertyInjectionWrapper');
        fixtures.dummyLogger.debug = origdebug;
    });
});


describe('defaultInjectors',
function ()
{
    it('must consist of expected injectors in exact order',
    function ()
    {
        impl.defaultInjectors.should.deep.equal(
        [
            new impl.ConstructorInjectorImpl(),
            new impl.InstancePropertyInjectorImpl(),
            new impl.InstanceMethodInjectorImpl(),
            new impl.StaticMethodInjectorImpl(),
            new impl.StaticPropertyInjectorImpl()
        ]);
    });
});

