import fs from 'fs'
let exp = /\/\/ (.+)\n+[A-Z]+\["(.+)"\]/g

fs.writeFileSync('./docs/commands.md',
  `# Commands\n\n**NOTE:** Anything with "index [number]" refers to the item at that specific index on the stack. "index 0" refers to the top of the stack, "index 1" refers to the second-from-top of stack, etc.\n\n## Sections\n\n${
    fs.readdirSync('./src/stdlib').map(f=>{
      let name = f.replace(/\.js/g, '').toUpperCase()
      return `- [${name}](#${name})`
    }).join`\n`
  }\n\n${
    fs.readdirSync('./src/stdlib').map(f=>{
      let sl = fs.readFileSync('./src/stdlib/' + f) + ''
      return `## ${
        f.replace(/\.js/g, '').toUpperCase()
      }\n\nCommand | Description\n--- | ---\n`
        + sl.match(exp).join`\n`
          .replace(exp, (_, d, c)=> `<code>${c.replace(/\|/g, '\\|')}</code> | ${d.replace(/\|/g, '\\|')}`)
    }).join`\n\n`
  }`
)

let readme = fs.readFileSync('./README.md') + ''
let txt = `\`\`\`
㌫㌭　　㌶㌶㌠㌶㌖㌂㌖㍔㍔㌴
㌟㌭　　㌚㌟㌫㌇㌠㍈㌽㌴㌮㌶
㌶㌗　　　　　　　　　　　　
㌄㌕　　㍖㌖　　㌠㌕㌮㌖㌫㍈
㍌㍖　　㍑㍊　　㌗㌕㌟㌴㌲㍊
㌫㌙　　㌗㌖　　㍌㍇　　㌭㌲
㍈㍊　　㌖㍌　　㌽㍖　　㍇㌭
㌇㍈　　㌭㌟　　㍃㌡　　㍈㍌
㍌㌮　　㌖㌄　　㌭㌇　　㌫㌫
㌖㌴　　　　　　　　　　　　
㍌㌡㍊㌖㍃㌂㍇㍑㍔㌗㌖㌫㌫㌕
㌙㍖㌡㍈㍈㍔㌗㌂㍇㌡㌄㌡㍇㌮
\`\`\``
let chars = `㌂㌄㌇㌕㌖㌗㌙㌚㌟㌠㌡㌫㌭㌮㌲㌴㌶㌽㍃㍇㍈㍊㍌㍑㍔㍖`
let chars1 = `㋿㍻㍼㍽㍾㍿`
txt = txt.split``.map(a=> a.match(/\s|　|`/) ? a : chars[0 | Math.random() * chars.length]).join``
fs.writeFileSync('./README.md',readme.replace(/^```.*```/s, txt))