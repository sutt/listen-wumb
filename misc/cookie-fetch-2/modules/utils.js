
const headersToArray = (response) => {
    
    output = []
    for (var kv of response.headers.entries()) {
        output.push(kv)
    }
    return output
}

const getSessCookie = (headersArr) => {
    
    for (const headerPair of headersArr) {
        const [k,v] = headerPair
        if (k.includes("set-cookie")) {
            const tokenStr = v.split(";")[0]
            const tmp      = tokenStr.split('=')
            const tokenObj = {
                [tmp[0]] : tmp[1]
            }
            return tokenObj
        }
    }
}


const obj2Str = (obj) => {
    s = ""
    for (const key of Object.keys(obj)) {
        s += key
        s += "="
        s += obj[key]
        // s += "&"  //maybe s += ";" when combining cookies
    }
    return s
}

const str2Obj = (str) => {
    const kvsArr = str.split("&")
    obj = {}
    for (const kv of kvsArr) {
        const [k,v] = kv.split("=")
        obj[k] = v
    }
    return obj
}


module.exports = {headersToArray, getSessCookie, obj2Str}

// const data = [
//     [ 'accept-ranges', 'bytes' ],
//     [ 'age', '0' ],
//     [ 'cache-control', 'max-age=172800' ],
//     [ 'connection', 'close' ],
//     [ 'content-encoding', 'gzip' ],
//     [ 'content-security-policy', 'upgrade-insecure-requests' ],
//     [ 'content-type', 'text/html; charset=UTF-8' ],
//     [ 'date', 'Tue, 28 Sep 2021 15:08:22 GMT' ],
//     [ 'expires', 'Thu, 30 Sep 2021 15:08:21 GMT' ],
//     [ 'server', 'openresty' ],
//     [
//       'set-cookie',
//       'SSESS2744f84ab896362390472b0afbbe54dd=qgscvovcie5n3j4po7fvort2nn; path=/; domain=.wumb.org; secure; HttpOnly'
//     ],
//     [
//       'strict-transport-security',
//       'max-age=300, max-age=31536000; includeSubDomains'
//     ],
//     [ 'transfer-encoding', 'chunked' ],
//     [ 'vary', 'Accept-Encoding, User-Agent' ],
//     [ 'x-backend', 'local' ],
//     [ 'x-cache', 'uncached' ],
//     [ 'x-cache-hit', 'MISS' ],
//     [ 'x-cacheable', 'YES:Forced' ],
//     [ 'x-content-type-options', 'nosniff' ],
//     [ 'x-xss-protection', '1; mode=block' ]
//   ]

// const ret = getSessCookie(data)
// console.log(ret)
