

import inxs from 'inxs';

import * as winston from 'winston';

import Calculator from './calc';


winston.level = 'error';


class Broker
{
    getInstance(iface)
    {
        if (iface == 'calc')
        {
            return new Calculator();
        }
        else if (iface == 'logger')
        {
            return this.logger;
        }
        else if (iface == 'broker')
        {
            return this;
        }

        throw new TypeError('unsupported interface ' + iface);
    }

    get logger()
    {
        return winston;
    }
}


const inject = inxs(new Broker());
export default inject;

