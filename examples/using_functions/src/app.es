

import inject from './broker';

import ICalculator from './calc/api';


export default class SimpleApp
{
    @inject('broker')
    get broker() {}

    @inject('logger')
    get logger() {}

    @inject(ICalculator)
    doSomething(calculator, x, y)
    {
        this.logger.info('calc x + y = ' + calculator.calc(x, y));
    }
}

