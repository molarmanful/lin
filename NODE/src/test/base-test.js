import {expect} from 'chai'
import {INT} from '../src/bridge.js'

describe('BASE', _=>{

  it('::', d=>{
    INT.run('\\a :: \\b :: a b\n#a 1\n#b 2')
    expect(INT.stack).to.eql({0: [2, 1]})

    d()
  })

})
