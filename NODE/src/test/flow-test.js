import {expect} from 'chai'
import {INT} from '../src/bridge.js'

describe('FLOW', _=>{

  it('::', d=>{
    INT.run('\\a :: \\b :: a b\n#a 1\n#b 2')
    expect(INT.stack).to.eql({0: [2, 1]})

    d()
  })

  it('es', d=>{
    INT.run('( 1 2 ( c ) ) es')
    expect(INT.stack).to.eql({0: ['c', 2, 1]})

    d()
  })

  it('e*', d=>{
    INT.run('1 ( 1 + ) 5 e*')
    expect(INT.stack).to.eql({0: [dec(6)]})

    d()
  })

  it('e& e| e?', d=>{
    INT.run('( \\t ) 1 e&')
    expect(INT.stack).to.eql({0: ['t']})

    INT.run('( \\t ) 0 e&')
    expect(INT.stack).to.eql({0: []})

    INT.run('( \\f ) 0 e|')
    expect(INT.stack).to.eql({0: ['f']})

    INT.run('( \\f ) 1 e|')
    expect(INT.stack).to.eql({0: []})

    INT.run('( \\t ) ( \\f ) 1 e?')
    expect(INT.stack).to.eql({0: ['t']})

    INT.run('( \\t ) ( \\f ) 0 e?')
    expect(INT.stack).to.eql({0: ['f']})

    d()
  })

  it('ew', d=>{
    INT.run('4 ( dup 1- ) \\dup ew')
    expect(INT.stack).to.eql({0: [0, 1, 2, 3].map(dec).concat(4)})

    INT.run('0 ( dup 1- ) \\dup ew')
    expect(INT.stack).to.eql({0: [0]})

    d()
  })

  it('e@ ; ;;', d=>{
    INT.run('1 ; 4\n2 ;\n3')
    expect(INT.stack).to.eql({0: [4, 3, 2, 1]})

    INT.run('1 2 e@\n3\n2 ;;')
    expect(INT.stack).to.eql({0: [3, 2, 1]})

    d()
  })

  it('break', d=>{
    INT.run('1 2 break 3 4')
    expect(INT.stack).to.eql({0: [2, 1]})

    d()
  })

})
