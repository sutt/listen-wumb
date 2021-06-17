const fetch = require('node-fetch')

let response = null
// url = "http://wumb.org/cgi-bin/playlist1.pl"
const url = "http://127.0.0.1/parse"

fetch(url)
    .then(res => {
        response = res   
        // console.log(res)
        // console.log(res.body)
    })