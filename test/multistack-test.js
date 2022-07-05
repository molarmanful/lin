import {expect} from 'chai'
import {dec, INT, SL} from '../src/bridge.js'

describe('MULTI-STACK', _=>{

  it("'s", d=>{
    INT.run("( 1 2 3 4 ) \\a 's")
    expect(INT.stack).to.eql({0: [], a: [4, 3, 2, 1]})

    INT.run("1 2 3 4 ( pop ) 0 's")
    expect(INT.stack).to.eql({0: [3, 2, 1]})

    d()
  })

  it('push pull', d=>{
    INT.run('1 2 3 4 \\a push')
    expect(INT.stack).to.eql({0: [3, 2, 1], a: [4]})

    INT.run("( 1 2 3 4 \\b push ) \\a 's ( \\a pull ) \\b 's \\a pull")
    expect(INT.stack).to.eql({0: [2], a: [1], b: [3, 4]})

    d()
  })

  it('merge', d=>{

    d()
  })

})
