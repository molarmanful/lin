import {expect} from 'chai'
import {dec, INT, SL} from '../src/bridge.js'

describe('STACK', _=>{

  it('pick dup tuck over', d=>{
    INT.run('1 2 3 4 2 pick')
    expect(INT.stack).to.eql({0: [2, 4, 3, 2, 1]})

    INT.run('1 2 3 4 5 pick')
    expect(INT.stack).to.eql({0: [3, 4, 3, 2, 1]})

    INT.run('1 2 3 4 dup')
    expect(INT.stack).to.eql({0: [4, 4, 3, 2, 1]})

    INT.run('1 2 3 4 tuck')
    expect(INT.stack).to.eql({0: [4, 3, 4, 2, 1]})

    INT.run('1 2 3 4 over')
    expect(INT.stack).to.eql({0: [3, 4, 3, 2, 1]})

    d()
  })

  it('nix pop nip clr', d=>{
    INT.run('1 2 3 4 2 nix')
    expect(INT.stack).to.eql({0: [4, 3, 1]})

    INT.run('1 2 3 4 5 nix')
    expect(INT.stack).to.eql({0: [4, 2, 1]})

    INT.run('1 2 3 4 pop')
    expect(INT.stack).to.eql({0: [3, 2, 1]})

    INT.run('1 2 3 4 nip')
    expect(INT.stack).to.eql({0: [4, 2, 1]})

    INT.run('1 2 3 4 clr')
    expect(INT.stack).to.eql({0: []})

    d()
  })

  it('roll roll_ rot rot_', d=>{
    INT.run('1 2 3 4 2 roll')
    expect(INT.stack).to.eql({0: [2, 4, 3, 1]})

    INT.run('1 2 3 4 5 roll')
    expect(INT.stack).to.eql({0: [3, 4, 2, 1]})

    INT.run('1 2 3 4 2 roll_')
    expect(INT.stack).to.eql({0: [3, 2, 4, 1]})

    INT.run('1 2 3 4 5 roll_')
    expect(INT.stack).to.eql({0: [3, 4, 2, 1]})

    INT.run('1 2 3 4 rot')
    expect(INT.stack).to.eql({0: [2, 4, 3, 1]})

    INT.run('1 2 3 4 rot_')
    expect(INT.stack).to.eql({0: [3, 2, 4, 1]})

    d()
  })

  it('trade swap rev', d=>{
    INT.run('1 2 3 4 2 trade')
    expect(INT.stack).to.eql({0: [2, 3, 4, 1]})

    INT.run('1 2 3 4 5 trade')
    expect(INT.stack).to.eql({0: [2, 3, 4, 1]})

    INT.run('1 2 3 4 swap')
    expect(INT.stack).to.eql({0: [3, 4, 2, 1]})

    INT.run('1 2 3 4 rev')
    expect(INT.stack).to.eql({0: [1, 2, 3, 4]})

    d()
  })

  it('dip', d=>{
    INT.run('1 2 3 4 \\pop dip')
    expect(INT.stack).to.eql({0: [4, 2, 1]})

    INT.run('1 2 3 4 \\; dip\n3.5')
    expect(INT.stack).to.eql({0: [4, 3.5, 3, 2, 1]})

    d()
  })

  it('size', d=>{
    INT.run('1 2 3 4 size')
    expect(INT.stack).to.eql({0: [4, 4, 3, 2, 1]})

    d()
  })

  it('uniq', d=>{
    INT.run('1 2 1 1 3 2 3 4 uniq')
    expect(INT.stack).to.eql({0: [4, 3, 2, 1]})

    d()
  })

  it('take drop', d=>{
    INT.run('1 2 3 4 2 take')
    expect(INT.stack).to.eql({0: [4, 3]})

    INT.run('1 2 3 4 2 drop')
    expect(INT.stack).to.eql({0: [2, 1]})

    d()
  })

})
