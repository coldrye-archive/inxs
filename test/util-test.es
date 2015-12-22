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

import * as fixtures from './fixtures';

import * as messages from '../src/messages';
import * as util from '../src/util';
import * as impl from '../src/impl';


describe('determineLogger()',
function ()
{
    it('must warn about missing broker.logger',
    function ()
    {
        assert.expect(1);
        const origwarn = console.warn;
        console.warn = function warn(msg)
        {
            assert.equal(msg, messages.MSG_BROKER_SHOULD_HAVE_LOGGER);
        };
        util.determineLogger(fixtures.simpleBroker);
        console.warn = origwarn;
    });

    it('must warn about missing logger methods',
    function ()
    {
        assert.expect(1);
        const origwarn = fixtures.simpleBrokerLogging.logger.warn;
        fixtures.simpleBrokerLogging.logger.warn = function warn(msg)
        {
            assert.ok(msg.indexOf('debug') != -1);
        };
        // make sure that the debug method is missing
        delete fixtures.simpleBrokerLogging.logger.debug;
        util.determineLogger(fixtures.simpleBrokerLogging);
        fixtures.simpleBrokerLogging.logger.warn = origwarn;
    });

    it('must not warn when logger meets all requirements',
    function ()
    {
        assert.expect(0);
        const origwarn = fixtures.simpleBrokerLogging.logger.warn;
        fixtures.simpleBrokerLogging.logger.warn = function warn()
        {
            assert.fail('must not have been called');
        };
        util.determineLogger(fixtures.simpleBrokerLogging);
        fixtures.simpleBrokerLogging.logger.warn = origwarn;
    });
});


describe('validateBroker()',
function ()
{
    it('must throw on null or non object broker',
    function ()
    {
        assert.expect(3);
        assert.throws(
        function ()
        {
            util.validateBroker(null);
        }, TypeError);

        assert.throws(
        function ()
        {
            util.validateBroker(undefined);
        }, TypeError);

        assert.throws(
        function ()
        {
            util.validateBroker(function () {});
        }, TypeError);
    });

    it('must throw on missing broker#getInstance()',
    function ()
    {
        assert.expect(1);
        assert.throws(
        function ()
        {
            util.validateBroker(fixtures.invalidBroker);
        }, TypeError);
    });

    it('must throw on invalid broker#getInstance()',
    function ()
    {
        assert.expect(1);
        assert.throws(
        function ()
        {
            util.validateBroker(
                fixtures.invalidBrokerGetInstanceMissingParameters
            );
        }, TypeError);
    });

    it('must warn on missing broker#validateInterfaces()',
    function ()
    {
        assert.expect(1);
        const origwarn = fixtures.dummyLogger.warn;
        fixtures.dummyLogger.warn = function warn(msg)
        {
            assert.equal(
                msg, messages.MSG_BROKER_SHOULD_IMPL_VALIDATE_INTERFACES
            );
        };
        util.validateBroker(fixtures.simpleBroker, fixtures.dummyLogger);
        fixtures.dummyLogger.warn = origwarn;
    });

    it('must not throw or warn on valid broker',
    function ()
    {
        assert.expect(1);
        const origwarn = fixtures.dummyLogger.warn;
        fixtures.dummyLogger.warn = function warn()
        {
            assert.fail('must not have been called');
        };

        assert.doesNotThrow(
        function ()
        {
            util.validateBroker(
                fixtures.simpleBrokerValidating, fixtures.dummyLogger
            );
        });
        fixtures.dummyLogger.warn = origwarn;
    });
});


describe('determineActualInjectors()',
function ()
{
    it('must throw when providing empty list of custom injectors',
    function ()
    {
        assert.expect(1);
        assert.throws(
        function ()
        {
            util.determineActualInjectors(impl.injectors, {customInjectors:[]});
        }, InjectionError);
    });

    it('must warn on invalid custom injector',
    function ()
    {
        assert.expect(5);
        const origwarn = fixtures.dummyLogger.warn;
        fixtures.dummyLogger.warn = function warn(msg)
        {
            assert.equal(
                msg, messages.MSG_INVALID_INJECTOR
            );
        };
        const expectedInjector = new impl.StaticPropertyInjectorImpl();
        const actualInjectors = util.determineActualInjectors(
            impl.injectors,
            {
                customInjectors: [
                    undefined, null, {}, function () {}, expectedInjector
                ],
                logger:fixtures.dummyLogger
            }
        );
        assert.deepEqual(actualInjectors, [expectedInjector]);
        fixtures.dummyLogger.warn = origwarn;
    });

    it('must not throw on available default injectors',
    function ()
    {
        let actualInjectors;

        assert.expect(2);
        assert.doesNotThrow(
        function ()
        {
            actualInjectors = util.determineActualInjectors(impl.injectors);
        });

        assert.deepEqual(actualInjectors, impl.injectors);
    });

    it('must return copy of injector suite chosen',
    function ()
    {
        assert.expect(1);
        let actualInjectors = util.determineActualInjectors(impl.injectors);
        actualInjectors.shift();
        assert.notDeepEqual(actualInjectors, impl.injectors);
    });

    it('must not throw on available custom injectors',
    function ()
    {
        assert.expect(1);
        assert.doesNotThrow(
        function ()
        {
            util.determineActualInjectors(
                null, {customInjectors:impl.injectors}
            );
        });
    });
});


describe('validateInterfaces()',
function ()
{
    it('must throw when called with non string/function interface',
    function ()
    {
        assert.expect(1);
        assert.throws(
        function ()
        {
            util.validateInterfaces(
                fixtures.simpleBrokerValidating, fixtures.dummyLogger,
                [0xDEADBEEF]
            );
        }, InjectionError);
    });

    it('must succeed on valid string/function interface',
    function ()
    {
        assert.expect(1);
        assert.doesNotThrow(
        function ()
        {
            util.validateInterfaces(
                fixtures.simpleBrokerValidating, fixtures.dummyLogger,
                ['someinterface', class otherinterface {}]
            );
        });
    });
});


describe('determineInjector()',
function ()
{
    it('must throw when missing any injectors',
    function ()
    {
        assert.expect(4);
        const origerror = fixtures.dummyLogger.error;
        fixtures.dummyLogger.error = function (message)
        {
            assert.equal(message, messages.MSG_NO_INJECTORS_AVAIL);
            // assert data.*
        };

        assert.throws(
        function ()
        {
            util.determineInjector(
                fixtures.injectionTarget, fixtures.attr,
                fixtures.propertyDescriptor, fixtures.dummyLogger, []
            );
        }, InjectionError);

        assert.throws(
        function ()
        {
            util.determineInjector(
                fixtures.injectionTarget, fixtures.attr,
                fixtures.propertyDescriptor, fixtures.dummyLogger
            );
        }, InjectionError);
        fixtures.dummyLogger.error = origerror;
    });

    it('must throw on missing required injector',
    function ()
    {
        assert.expect(8);
        const origerror = fixtures.dummyLogger.error;
        fixtures.dummyLogger.error = function (message)
        {
            assert.equal(message, messages.MSG_UNSUPPORTED_INJECTION_METHOD);
            // assert data.*
        };

        assert.throws(
        function ()
        {
            util.determineInjector(
                fixtures.injectionTarget, fixtures.attr,
                fixtures.propertyDescriptor, fixtures.dummyLogger,
                [new impl.StaticPropertyInjectorImpl()]
            );
        }, InjectionError);

        assert.throws(
        function ()
        {
            util.determineInjector(
                fixtures.injectionTarget, fixtures.attr,
                fixtures.methodDescriptor, fixtures.dummyLogger,
                [new impl.StaticPropertyInjectorImpl()]
            );
        }, InjectionError);

        assert.throws(
        function ()
        {
            util.determineInjector(
                fixtures.InjectionTarget, fixtures.attr,
                fixtures.propertyDescriptor, fixtures.dummyLogger,
                [new impl.InstancePropertyInjectorImpl()]
            );
        }, InjectionError);

        assert.throws(
        function ()
        {
            util.determineInjector(
                fixtures.InjectionTarget, fixtures.attr,
                fixtures.methodDescriptor, fixtures.dummyLogger,
                [new impl.StaticPropertyInjectorImpl()]
            );
        }, InjectionError);
        fixtures.dummyLogger.error = origerror;
    });

    it('must return expected injector',
    function ()
    {
        assert.expect(4);

        let actualInjector;

        actualInjector = util.determineInjector(
                fixtures.InjectionTarget, fixtures.attr,
                fixtures.methodDescriptor, fixtures.dummyLogger,
                impl.injectors
        );

        assert.deepEqual(actualInjector, new impl.StaticMethodInjectorImpl());

        actualInjector = util.determineInjector(
                fixtures.injectionTarget, fixtures.attr,
                fixtures.methodDescriptor, fixtures.dummyLogger,
                impl.injectors
        );

        assert.deepEqual(actualInjector, new impl.InstanceMethodInjectorImpl());

        actualInjector = util.determineInjector(
                fixtures.InjectionTarget, fixtures.attr,
                fixtures.propertyDescriptor, fixtures.dummyLogger,
                impl.injectors
        );

        assert.deepEqual(actualInjector, new impl.StaticPropertyInjectorImpl());

        actualInjector = util.determineInjector(
                fixtures.injectionTarget, fixtures.attr,
                fixtures.propertyDescriptor, fixtures.dummyLogger,
                impl.injectors
        );

        assert.deepEqual(
            actualInjector,
            new impl.InstancePropertyInjectorImpl()
        );
    });
});

