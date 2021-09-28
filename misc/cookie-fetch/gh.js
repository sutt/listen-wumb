const fetch = require("node-fetch")
const url = "https://github.com/sutt/"

fetch(url)
    .then(res => {
        for (var pair of res.headers.entries()) {
            console.log(pair)
        }
    })

