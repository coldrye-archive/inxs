

import ICalculator from './api';


export default class CalculatorImpl extends ICalculator
{
    calc(a, b)
    {
        return a + b;
    }
}

