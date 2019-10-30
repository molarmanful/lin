import {expect} from 'chai'
import {INT, SL} from '../src/bridge.js'

describe('MULTI-STACK', _=>{

  it('stack', d=>{
    INT.run('( 1 2 3 4 ) \\a stack')
    expect(INT.stack).to.eql({0: [], a: [4, 3, 2, 1]})

    INT.run('1 2 3 4 ( pop ) 0 stack')
    expect(INT.stack).to.eql({0: [3, 2, 1]})

    d()
  })

  it('push pull', d=>{
    INT.run('1 2 3 4 \\a push')
    expect(INT.stack).to.eql({0: [3, 2, 1], a: [4]})

    INT.run('( 1 2 3 4 \\b push ) \\a stack ( \\a pull ) \\b stack \\a pull')
    expect(INT.stack).to.eql({0: [2], a: [1], b: [3, 4]})

    d()
  })

  it('merge', d=>{
    INT.run('1 2 3 4 \\a push')
    expect(INT.stack).to.eql({0: [3, 2, 1], a: [4]})

    INT.run('( 1 2 3 4 \\b push ) \\a stack ( \\a pull ) \\b stack \\a pull')
    expect(INT.stack).to.eql({0: [2], a: [1], b: [3, 4]})

    d()
  })

  it('union intersection difference', d=>{
    INT.run('1 2 3 4 ( 3 4 5 6 ) \\a stack \\a union')
    expect(INT.stack).to.be.eql({0: [6, 5, 4, 3, 2, 1], a: [6, 5, 4, 3]})

    INT.run('1 2 3 4 ( 3 4 5 6 ) \\a stack \\a intersection')
    expect(INT.stack).to.be.eql({0: [4, 3], a: [6, 5, 4, 3]})

    INT.run('1 2 3 4 ( 3 4 5 6 ) \\a stack \\a difference')
    expect(INT.stack).to.be.eql({0: [2, 1], a: [6, 5, 4, 3]})

    d()
  })

})
