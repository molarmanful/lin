let parse = x=>{
  let lit = 0
  let esc = 0
  return x.split``.reduce((tree,a)=>{
    let last = tree[tree.length - 1]

    // inside literal
    if(lit){
      if(esc) esc = 0, last.value += a == '"' ? a : '\\' + a
      else if(a == '\\') esc = 1
      else if(a == '"') last.value += a, lit = 0
      else last.value += a
    }

    // start literal
    else if(a == '"'){
      lit = 1
      tree.push({type: 'lit', value: '"'})
    }

    // number
    else if(a.match(/[0-9]/)){
      if(tree.length && last.type == 'num')
        last.value += a
      else tree.push({type: 'num', value: a})
    }

    // decimal
    else if(a == '.'){
      if(tree.length && last.type == 'num' && !last.value.match(/\./))
        last.value += a
      else tree.push({type: 'num', value: a})
    }

    // key
    else if(a.match(/[^0-9. ]/)){
      if(tree.length && last.type == 'key')
        last.value += a
      else tree.push({type: 'key', value: a})
    }

    return tree
  }, []).map(a=> a.value)
}

export default parse