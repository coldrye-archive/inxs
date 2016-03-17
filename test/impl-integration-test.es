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

            InjectionTarget.injected.should.equal('injected');
        });

        it('into a static method',
        function ()
        {
            const inject = inxs(fixtures.simpleBrokerValidating);

            class InjectionTarget
            {
                @inject('iface')
                static test(injected)
                {
                    injected.should.equal('injected');
                }
            }

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
            injectionTarget.injected.should.equal('injected');
        });

        it('into an instance method',
        function ()
        {
            const inject = inxs(fixtures.simpleBrokerValidating);

            class InjectionTarget
            {
                @inject('iface')
                test(injected)
                {
                    injected.should.equal('injected');
                }
            }

            const injectionTarget = new InjectionTarget();
            injectionTarget.test();
        });

        it('into constructor',
        function ()
        {
            const tracker = {called:false};
            const inject = inxs(fixtures.simpleBrokerValidating);

            @inject('iface')
            class InjectionTarget
            {
                constructor(injected)
                {
                    injected.should.equal('injected');
                    tracker.called = true;
                }
            }
            new InjectionTarget();
            tracker.called.should.be.ok;
        });
    });

    describe('must properly pass injected parameters and user parameters',
    function ()
    {
        it('into static methods',
        function ()
        {
            const inject = inxs(fixtures.simpleBrokerValidating);

            class InjectionTarget
            {
                @inject('iface')
                static test(injected, param1)
                {
                    injected.should.equal('injected');
                    param1.should.equal('param1');
                }
            }

            InjectionTarget.test('param1');
        });

        it('into instance methods',
        function ()
        {
            const inject = inxs(fixtures.simpleBrokerValidating);

            class InjectionTarget
            {
                @inject('iface')
                test(injected, param1)
                {
                    injected.should.equal('injected');
                    param1.should.equal('param1');
                }
            }

            new InjectionTarget().test('param1');
        });

        it('while not losing additional non formal user parameters',
        function ()
        {
            const inject = inxs(fixtures.simpleBrokerValidating);

            class InjectionTarget
            {
                @inject('iface')
                test(injected, param1)
                {
                    injected.should.equal('injected');
                    param1.should.equal('param1');
                    arguments.length.should.equal(3);
                    arguments[2].should.equal('param2');
                }
            }

            new InjectionTarget().test('param1', 'param2');
        });

        it('while not failing on missing formal user parameters',
        function ()
        {
            const inject = inxs(fixtures.simpleBrokerValidating);

            class InjectionTarget
            {
                @inject('iface')
                test(injected, param1)
                {
                    injected.should.equal('injected');
                    should.not.exist(param1);
                }
            }

            new InjectionTarget().test();
        });
    });
});

