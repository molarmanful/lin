import {expect} from 'chai'
import {dec, INT, SL} from '../src/bridge.js'

describe('NUMBERS', _=>{

  it('constants', d=>{
    INT.run('$E')
    expect(INT.stack).to.eql({0: [dec.exp(1)]})

    INT.run('$Pi')
    expect(INT.stack).to.eql({0: [dec.acos(-1)]})

    d()
  })

  it('E', d=>{
    INT.run('3.5 3 E 3.5 3_ E')
    expect(INT.stack).to.eql({0: [.0035, 3500].map(dec)})

    d()
  })

  it('_', d=>{
    INT.run('1_')
    expect(INT.stack).to.eql({0: [-1].map(dec)})

    d()
  })

  it('+ - * / // % /% ^', d=>{
    INT.run('4 3+ 4 3- 4 3* 4 3/ 4 3// 4 3% 4 3/% 4 3^')
    expect(INT.stack).to.eql({0: [64, 1, 1, 1, 1, dec.div(4, 3), 12, 1, 7].map(dec)})

    d()
  })


  it('abs sign', d=>{
    INT.run('4_ abs 4_ sign')
    expect(INT.stack).to.eql({0: [-1, dec(4)]})

    d()
  })

  it('rand time', d=>{
    // how do I even test this?

    d()
  })

  it('ln logII logX log', d=>{
    INT.run('$E ln 2 logII 10 logX 5 5log')
    expect(INT.stack).to.eql({0: [1, 1, 1, 1].map(dec)})

    d()
  })

  it('sin cos tan sinh cosh tanh', d=>{
    // TODO?

    d()
  })

  it('asin acos atan atant asinh acosh atanh', d=>{
    // TODO?

    d()
  })

  it('max min', d=>{
    INT.run('1 2 3 4 5 max min')
    expect(INT.stack).to.eql({0: [1, 5].map(dec).concat([5, 4, 3, 2, 1])})

    d()
  })

  it('~ ! & | $ << >> >>>', d=>{
    INT.run('1_ ~ 1! 1 0& 1 0| 1 1$ 1 2<< 4 1>> 8 1>>>')
    expect(INT.stack).to.eql({0: [4, 2, 4, 0, 1, 0, 0, 0]})

    d()
  })

  it('= != > < >= <= <=>', d=>{
    INT.run('1 1= 1 3!= 2 1> 2 1< 1 2>= 1 2<= 1 3<=> 3 1<=> 1 1<=>')
    expect(INT.stack).to.eql({0: [0, 1, -1, 1, 0, 0, 1, 1, 1]})

    d()
  })

  it('floor trunc round ceil', d=>{
    INT.run('1.6_ floor 1.6_ trunc 1.6_ round 1.6_ ceil')
    expect(INT.stack).to.eql({0: [-1, -2, -1, -2].map(dec)})

    d()
  })

})
