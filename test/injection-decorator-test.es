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

import inxs from '../src/inxs';

import * as fixtures from './fixtures';


describe('inxs()', function ()
{
    it('must return injection decorator', function ()
    {
        const decorator = inxs(fixtures.simpleBroker);
        decorator.should.be.a.function;
        decorator.name.should.equal('injectionDecoratorWrapper');
    });
});


describe('injection decorator', function ()
{
    describe('when called with validating broker', function ()
    {
        const injectionDecorator = inxs(fixtures.simpleBrokerValidating);

        it('must throw when called with zero interfaces', function ()
        {
            function tc()
            {
                injectionDecorator();
            }
            tc.should.throw(InjectionError, 'no interfaces specified');
        });

        it('must throw when called with null interface', function ()
        {
            function tc()
            {
                injectionDecorator(null);
            }
            tc.should.throw(InjectionError, 'invalid interface');
        });
    });
});

