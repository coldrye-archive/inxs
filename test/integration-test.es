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

import InjectionError from 'inxs-common/lib/exceptions';

import * as fixtures from './fixtures';

import inxs from '../src/inxs';


describe('inxs',
function ()
{
    describe('must decorate and inject properly',
    function ()
    {
        it('into a static property',
        function ()
        {
            const inject = inxs(fixtures.simpleBrokerValidating);

            class InjectionTarget
            {
                @inject('iface')
                static get injected () {}
            }

            assert.equal(InjectionTarget.injected, 'injected');
        });

        it('into a static method',
        function ()
        {
            assert.expect(2);

            const inject = inxs(fixtures.simpleBrokerValidating);

            class InjectionTarget
            {
                @inject('iface')
                static test(injected)
                {
                    assert.equal(injected, 'injected');
                }
            }

            assert.equal(InjectionTarget.test.name, 'methodInjectionWrapper');
            InjectionTarget.test();
        });

        it('into an instance property',
        function ()
        {
            const inject = inxs(fixtures.simpleBrokerValidating);

            class InjectionTarget
            {
                @inject('iface')
                get injected () {}
            }

            const injectionTarget = new InjectionTarget();
            assert.equal(injectionTarget.injected, 'injected');
        });

        it('into an instance method',
        function ()
        {
            assert.expect(2);

            const inject = inxs(fixtures.simpleBrokerValidating);

            class InjectionTarget
            {
                @inject('iface')
                test(injected)
                {
                    assert.equal(injected, 'injected');
                }
            }

            const injectionTarget = new InjectionTarget();
            assert.equal(injectionTarget.test.name, 'methodInjectionWrapper');
            injectionTarget.test();
        });
    });

    it('must throw on attempted constructor injection',
    function ()
    {
        assert.expect(1);

        const inject = inxs(fixtures.simpleBrokerValidating);

        assert.throws(
        function ()
        {
            /*eslint no-unused-vars:0*/
            @inject('iface')
            class InjectionTarget
            {
            }
        }, InjectionError);
    });

    describe('must properly pass injected parameters and user parameters',
    function ()
    {
        it('into static methods',
        function ()
        {
            assert.expect(2);

            const inject = inxs(fixtures.simpleBrokerValidating);

            class InjectionTarget
            {
                @inject('iface')
                static test(injected, param1)
                {
                    assert.equal(injected, 'injected');
                    assert.equal(param1, 'param1');
                }
            }

            InjectionTarget.test('param1');
        });

        it('into instance methods',
        function ()
        {
            assert.expect(2);

            const inject = inxs(fixtures.simpleBrokerValidating);

            class InjectionTarget
            {
                @inject('iface')
                test(injected, param1)
                {
                    assert.equal(injected, 'injected');
                    assert.equal(param1, 'param1');
                }
            }

            new InjectionTarget().test('param1');
        });

        it('while not losing additional non formal user parameters',
        function ()
        {
            assert.expect(4);

            const inject = inxs(fixtures.simpleBrokerValidating);

            class InjectionTarget
            {
                @inject('iface')
                test(injected, param1)
                {
                    assert.equal(injected, 'injected');
                    assert.equal(param1, 'param1');
                    assert.equal(arguments.length, 3);
                    assert.equal(arguments[2], 'param2');
                }
            }

            new InjectionTarget().test('param1', 'param2');
        });

        it('while not failing on missing formal user parameters',
        function ()
        {
            assert.expect(2);

            const inject = inxs(fixtures.simpleBrokerValidating);

            class InjectionTarget
            {
                @inject('iface')
                test(injected, param1)
                {
                    assert.equal(injected, 'injected');
                    assert.ok(typeof param1 == 'undefined');
                }
            }

            new InjectionTarget().test();
        });
    });
});

