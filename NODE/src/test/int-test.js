import {expect} from 'chai'
import {INT} from '../src/bridge.js'

describe('PARSE', _=>{

  it('blanks', d=>{
    expect(INT.parse('')).to.be.empty
    expect(INT.parse(' ')).to.be.empty
    expect(INT.parse('  ')).to.be.empty
    d()
  })

  it('integers', d=>{
    expect(INT.parse('0 1 2 3 4')).to.eql([0, 1, 2, 3, 4])
    expect(INT.parse('2055')).to.eql([2055])
    d()
  })

  it('decimals', d=>{
    expect(INT.parse('1. .1 1.1')).to.eql([1, .1, 1.1])
    expect(INT.parse('91.1.1')).to.eql([91.1, .1])
    d()
  })

  it('keys', d=>{
    expect(INT.parse('a \\b c')).to.eql(['a', '\\b', 'c'])
    d()
  })

  it('mix', d=>{
    expect(INT.parse('a1 ( b 2) c 3')).to.eql(['a', 1, '(', 'b', 2, ')', 'c', 3])
    d()
  })

})

describe('FORMAT', _=>{

  it('blanks', d=>{
    expect(INT.form([])).to.equal('')
    d()
  })

  it('numbers', d=>{
    expect(INT.form([1234])).to.equal('1234')
    d()
  })

  it('strings', d=>{
    expect(INT.form(['Hello, world!'])).to.equal('"Hello, world!"')
    d()
  })

  it('lists', d=>{
    expect(INT.form([["4x", [3, 2], 1]])).to.equal('[ 1 [ 2 3 ] "4x" ]')
    d()
  })

  it('objects', d=>{
    expect(INT.form([{a: 1, b: "c", c: [3, 2, 1]}])).to.equal('{ "a": 1 "b": "c" "c": [ 1 2 3 ] }')
    d()
  })

  it('mix', d=>{
    expect(INT.form([{a: 1}, [1], "1", 1])).to.equal('1\n"1"\n[ 1 ]\n{ "a": 1 }')
    d()
  })

})
