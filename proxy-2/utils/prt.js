const prt = (o) => {
    const maxOutputChars = 300
    if (false) {
        return o
    } else {
        if (typeof o === 'object') {
            return JSON.stringify(o, null, 4).slice(0, maxOutputChars)
        } else {
            return o.slice(0, maxOutputChars)
        }
    }
}

module.exports = prt