

import inject from './broker';


export default class SimpleApp
{
    @inject('broker')
    get broker() {}

    @inject('logger')
    get logger() {}

    @inject('calc')
    doSomething(calculator, x, y)
    {
        this.logger.info('calc x + y = ' + calculator.calc(x, y));
    }
}

