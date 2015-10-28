

import inject from './broker';

import CALC from './calc/api';


export default class SimpleApp
{
    @inject('broker')
    get broker() {}

    @inject('logger')
    get logger() {}

    @inject(CALC)
    doSomething(calculator, x, y)
    {
        this.logger.info('calc x + y = ' + calculator.calc(x, y));
    }
}

