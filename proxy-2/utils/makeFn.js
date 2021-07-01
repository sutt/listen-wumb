const fs = require('fs')

const makeFn = (baseFn, outputDirectory = './') => {
    /* 
        make a unique filename to write to a json file to `outputDirectory`
        with a `baseFn` root, via incrementing a number in the filename.
            
        e.g: 
            directory: a-1.json, b-1.json, b-2.json
            baseFn:    a
            output:    a-2.json
    */
    const baseMatches = fs.readdirSync(outputDirectory).filter(fn => {
                            return fn.includes(".json") && fn.includes(baseFn)
    })
    const fnNums    = baseMatches.map(fn => parseInt(
        Array.from(fn).filter(letter => !isNaN(letter)).join()
    ))
    const maxNum    = fnNums.length > 0 ? Math.max(...fnNums) : 0
    const fn        = `${outputDirectory}${baseFn}-${maxNum + 1}.json`

    return fn
}


module.exports = makeFn