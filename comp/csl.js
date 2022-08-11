import sh from 'shelljs'
let exp = /\/\/ (.+)\n+[A-Z]+\["(.+)"\]/g

sh.ShellString(`# Commands\n\n**NOTE:** Anything with "index [number]" refers to the item at that specific index on the stack. "index 0" refers to the top of the stack, "index 1" refers to the second-from-top of stack, etc.\n\n## Sections\n\n${
  sh.ls('src/stdlib').map(f=>{
    let name = f.replace(/\.js/g, '').toUpperCase()
    return `- [${name}](#${name})`
  }).join`\n`
}\n\n${
  sh.ls('src/stdlib').map(f=>{
    let sl = sh.cat('src/stdlib/' + f)
    return `## ${
      f.replace(/\.js/g, '').toUpperCase()
    }\n\nCommand | Description\n--- | ---\n`
      + (sl.match(exp) || []).join`\n`
        .replace(exp, (_, d, c)=> `<code>${c.replace(/\|/g, '\\|').replace(/`/g, '\\`')}</code> | ${d.replace(/\|/g, '\\|')}`)
  }).join`\n\n`
}`).to('docs/commands.md')

let readme = sh.cat('README.md')
let txt = `\`\`\`
㌫㌭　　㌶㌶㌠㌶㌖㌂㌖㍔㍔㌴
㌟㌭　　㌚㌟㌫㌇㌠㍈㌽㌴㌮㌶
㌶㌗　　　　　　　　　　　　
㌄㌕　　㍖㌖　　㌠㌕㌮㌖㌫㍈
㍌㍖　　㍑㍊　　㌗㌕㌟㌴㌲㍊
㌫㌙　　㌗㌖　　㍌㍇　　㌭㌲
㍈㍊　　㌖㍌　　㌽㍖　　㍇㌭
㌇㍈　　㌭㌟　　㍃㌡　　㍈㍌
㌖㌴　　　　　　　　　　　　
㍌㌡㍊㌖㍃㌂㍇㍑㍔㌗㌖㌫㌫㌕
㌙㍖㌡㍈㍈㍔㌗㌂㍇㌡㌄㌡㍇㌮
\`\`\``
let chars = `㌂㌄㌇㌕㌖㌗㌙㌚㌟㌠㌡㌫㌭㌮㌲㌴㌶㌽㍃㍇㍈㍊㍌㍑㍔㍖`
txt = txt.split``.map(a=> a.match(/\s|　|`/) ? a : chars[0 | Math.random() * chars.length]).join``
sh.ShellString(readme.replace(/^```.*?```/s, txt)).to('README.md')