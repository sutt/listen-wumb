const fs = require('fs')

// const obj = {a:1, b:2}
// const ret = fs.writeFileSync('./demo.txt', JSON.stringify(obj) )
// console.log(`done with ret: ${ret}`)

const DATA_DIR = './'
const jsonFiles = fs.readdirSync(DATA_DIR).filter(fn => fn.includes(".json"))
const fnNums    = jsonFiles.map(fn => parseInt(fn.split('res')[1].split('.')[0]))
const maxNum    = Math.max(...fnNums)

console.log(`max num: ${maxNum}`)

// const baseFn = "res"
// const ext    = ".json"
// let  iFn     = 1



