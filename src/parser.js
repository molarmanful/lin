let parse = x=>

  x.split``.reduce((tree,a)=>{
    let last = tree[tree.length - 1]

    // number
    if(a.match(/[0-9]/)){
      if(tree.length && last.type == 'num')
        tree[tree.length - 1].value += a
      else tree.push({type: 'num', value: a})
    }

    // decimal
    else if(a == '.'){
      if(tree.length && last.type == 'num' && !last.value.match(/\./))
        tree[tree.length - 1].value += a
      else tree.push({type: 'num', value: a})
    }

    // key
    else if(a.match(/[^0-9. ]/)){
      if(tree.length && last.type == 'key')
        tree[tree.length - 1].value += a
      else tree.push({type: 'key', value: a})
    }

    else tree.push(' ')

    return tree

  }, []).reduce((a, b, X)=> b.type ? a.concat(b.value) : a, [])

export default parse
