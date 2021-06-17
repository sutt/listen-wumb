const fetch = require('node-fetch')

let response = null
let response2 = null
// url = "http://wumb.org/cgi-bin/playlist1.pl"
url = "http://127.0.0.1:3005/page"

fetch(url)
    .then(res => {
        response = res   
        // console.log(res)
        // console.log(res.body)
    })

// (async () => {
//     tmp = await fetch(url);
//     tmp2 = await tmp.text();
//     response2 = tmp2
// })()