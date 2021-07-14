const stripKeys = (obj, arrKeys) => {
    /*
        returns an duplicate object to `obj` 
        stripped of and keys listed in `arrKeys`

        e.g.:
            in  = {a:1, b:2, c:3, d:4}
            out = stripKeys(in, ['a','c'])
            out:  {b:2, d:4}
    */
    let tmp = {}
    for (key of Object.keys(obj)) {
        if (!arrKeys.includes(key)) tmp[key] = obj[key]
    }
    return tmp
}


module.exports = stripKeys