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

import * as fixtures from './fixtures';

import * as utils from '../src/utils';
import * as impl from '../src/impl';


describe('determineLogger()',
function ()
{
    it('must fall back to console when broker.logger is undefined',
    function ()
    {
        utils.determineLogger(fixtures.simpleBroker).should.equal(console);
    });

    it('must not warn when logger meets all requirements',
    function ()
    {
        const origwarn = fixtures.simpleBrokerLogging.logger.warn;
        fixtures.simpleBrokerLogging.logger.warn = function warn()
        {
            throw new Error('must not have been called');
        };
        utils.determineLogger(fixtures.simpleBrokerLogging);
        fixtures.simpleBrokerLogging.logger.warn = origwarn;
    });
});


describe('validateBroker()',
function ()
{
    it('must throw on null or non object broker',
    function ()
    {
        function tc1()
        {
            utils.validateBroker(null, console);
        }
        tc1.should.throw(TypeError, 'broker must be an object');

        function tc2()
        {
            utils.validateBroker(undefined, console);
        }
        tc2.should.throw(TypeError, 'broker must be an object');

        function tc3()
        {
            utils.validateBroker(function () {}, console);
        }
        tc3.should.throw(TypeError, 'broker must be an object');
    });

    it('must throw on missing broker#getInstance()',
    function ()
    {
        function tc()
        {
            utils.validateBroker(fixtures.invalidBroker, console);
        }
        tc.should.throw(TypeError, 'getInstance');
    });

    it('must throw on invalid broker#getInstance()',
    function ()
    {
        function tc()
        {
            utils.validateBroker(
                fixtures.invalidBrokerGetInstanceMissingParameters, console
            );
        }
        tc.should.throw(TypeError, 'getInstance');
    });

    it('must not throw or warn on valid broker',
    function ()
    {
        const origwarn = fixtures.dummyLogger.warn;
        fixtures.dummyLogger.warn = function warn()
        {
            throw new Error('must not have been called');
        };

        function tc()
        {
            utils.validateBroker(
                fixtures.simpleBrokerValidating, fixtures.dummyLogger
            );
        }
        tc.should.not.throw(TypeError);
        fixtures.dummyLogger.warn = origwarn;
    });
});


describe('determineActualInjectors()',
function ()
{
    it('must throw when providing empty list of custom injectors',
    function ()
    {
        function tc()
        {
            utils.determineActualInjectors(impl.defaultInjectors, console, []);
        }
        tc.should.throw(InjectionError, 'no injectors available');
    });

    it('must warn on invalid custom injector and return only valid ones',
    function ()
    {
        const origwarn = fixtures.dummyLogger.warn;
        fixtures.dummyLogger.warn = function warn(msg)
        {
            msg.should.contain('instance of AbstractInjector');
        };
        const expectedInjector = new impl.StaticPropertyInjectorImpl();
        const actualInjectors = utils.determineActualInjectors(
            impl.defaultInjectors, fixtures.dummyLogger,
            [undefined, null, {}, function () {}, expectedInjector]
        );
        actualInjectors.should.deep.equal([expectedInjector]);
        fixtures.dummyLogger.warn = origwarn;
    });

    it('must not throw on available default injectors',
    function ()
    {
        function tc()
        {
            utils.determineActualInjectors(
                impl.defaultInjectors, console
            );
        }
        tc.should.not.throw();
    });

    it('must return copy of injector suite chosen',
    function ()
    {
        let actualInjectors = utils.determineActualInjectors(
            impl.defaultInjectors, console
        );
        actualInjectors.should.deep.equal(impl.defaultInjectors);
        actualInjectors.shift();
        actualInjectors.should.not.deep.equal(impl.defaultInjectors);
    });

    it('must not throw on available custom injectors',
    function ()
    {
        function tc()
        {
            utils.determineActualInjectors(
                null, console, impl.defaultInjectors
            );
        }
        tc.should.not.throw();
    });
});


describe('validateInterfaces()',
function ()
{
    it('must throw when called with non string/function/symbol InterfaceType',
    function ()
    {
        function tc()
        {
            utils.validateInterfaces(
                fixtures.simpleBrokerValidating, fixtures.dummyLogger,
                [0xDEADBEEF]
            );
        }
        tc.should.throw(InjectionError, 'invalid interface');
    });

    it('must succeed on valid string/function/symbol InterfaceType',
    function ()
    {
        function tc()
        {
            utils.validateInterfaces(
                fixtures.simpleBrokerValidating, fixtures.dummyLogger,
                ['someinterface', class otherinterface {}, Symbol()]
            );
        }
        tc.should.not.throw();
    });
});


describe('determineInjector()',
function ()
{
    it('must throw when missing any injectors',
    function ()
    {
        const origerror = fixtures.dummyLogger.error;
        fixtures.dummyLogger.error = function (msg)
        {
            msg.should.contain('no injectors available');
        };

        function tc1()
        {
            utils.determineInjector(
                fixtures.injectionTarget, fixtures.attr,
                fixtures.propertyDescriptor, fixtures.dummyLogger, []
            );
        }
        tc1.should.throw(InjectionError, 'no injectors available');

        function tc2()
        {
            utils.determineInjector(
                fixtures.injectionTarget, fixtures.attr,
                fixtures.propertyDescriptor, fixtures.dummyLogger
            );
        }
        tc2.should.throw(InjectionError, 'no injectors available');
        fixtures.dummyLogger.error = origerror;
    });

    it('must throw on missing required injector',
    function ()
    {
        const origerror = fixtures.dummyLogger.error;
        fixtures.dummyLogger.error = function (msg)
        {
            msg.should.contain('unsupported injection method');
        };

        function tc1()
        {
            utils.determineInjector(
                fixtures.injectionTarget, fixtures.attr,
                fixtures.propertyDescriptor, fixtures.dummyLogger,
                [new impl.StaticPropertyInjectorImpl()]
            );
        }
        tc1.should.throw(InjectionError, 'unsupported injection method');

        function tc2()
        {
            utils.determineInjector(
                fixtures.injectionTarget, fixtures.attr,
                fixtures.methodDescriptor, fixtures.dummyLogger,
                [new impl.StaticPropertyInjectorImpl()]
            );
        }
        tc2.should.throw(InjectionError, 'unsupported injection method');

        function tc3()
        {
            utils.determineInjector(
                fixtures.InjectionTarget, fixtures.attr,
                fixtures.propertyDescriptor, fixtures.dummyLogger,
                [new impl.InstancePropertyInjectorImpl()]
            );
        }
        tc3.should.throw(InjectionError, 'unsupported injection method');

        function tc4()
        {
            utils.determineInjector(
                fixtures.InjectionTarget, fixtures.attr,
                fixtures.methodDescriptor, fixtures.dummyLogger,
                [new impl.StaticPropertyInjectorImpl()]
            );
        }
        tc4.should.throw(InjectionError, 'unsupported injection method');
        fixtures.dummyLogger.error = origerror;
    });

    describe('must return expected injector',
    function ()
    {
        it('StaticMethodInjectorImpl',
        function ()
        {
            utils.determineInjector(
                fixtures.InjectionTarget, fixtures.attr,
                fixtures.methodDescriptor, fixtures.dummyLogger,
                impl.defaultInjectors
            ).should.deep.equal(new impl.StaticMethodInjectorImpl());
        });

        it('InstanceMethodInjectorImpl',
        function ()
        {
            utils.determineInjector(
                fixtures.injectionTarget, fixtures.attr,
                fixtures.methodDescriptor, fixtures.dummyLogger,
                impl.defaultInjectors
            ).should.deep.equal(new impl.InstanceMethodInjectorImpl());
        });

        it('StaticPropertyInjectorImpl',
        function ()
        {
            utils.determineInjector(
                fixtures.InjectionTarget, fixtures.attr,
                fixtures.propertyDataDescriptor, fixtures.dummyLogger,
                impl.defaultInjectors
            ).should.deep.equal(new impl.StaticPropertyInjectorImpl());
        });

        it('StaticPropertyInjectorImpl',
        function ()
        {
            utils.determineInjector(
                fixtures.InjectionTarget, fixtures.attr,
                fixtures.accessorPropertyDescriptor, fixtures.dummyLogger,
                impl.defaultInjectors
            ).should.deep.equal(new impl.StaticPropertyInjectorImpl());
        });

        it('InstancePropertyInjectorImpl',
        function ()
        {
            utils.determineInjector(
                fixtures.injectionTarget, fixtures.attr,
                fixtures.propertyDataDescriptor, fixtures.dummyLogger,
                impl.defaultInjectors
            ).should.deep.equal(new impl.InstancePropertyInjectorImpl());
        });

        it('InstancePropertyInjectorImpl',
        function ()
        {
            utils.determineInjector(
                fixtures.injectionTarget, fixtures.attr,
                fixtures.accessorPropertyDescriptor, fixtures.dummyLogger,
                impl.defaultInjectors
            ).should.deep.equal(new impl.InstancePropertyInjectorImpl());
        });
    });
});

