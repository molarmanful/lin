let unesc = x=>

  x.replace(/\\(u\{([0-9A-Fa-f]+)\}|u([0-9A-Fa-f]{4})|x([0-9A-Fa-f]{2})|([1-7][0-7]{0,2}|[0-7]{2,3})|(['"tbrnfv0\\]))|\\U([0-9A-Fa-f]{8})/g, (_,$,hex,lhex,shex,oct,spec,py)=>

    hex || lhex || shex || py ?
      String.fromCodePoint(parseInt(hex || lhex || shex || py, 16))
    : oct ?
      String.fromCodePoint(parseInt(oct, 8))
    : {'0': '\0', 'b': '\b', 'f': '\f', 'n': '\n', 'r': '\r', 't': '\t', 'v': '\v', '\'': '\'', '"': '"', '\\': '\\'}[spec]

  )

export default unesc
