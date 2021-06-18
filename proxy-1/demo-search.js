require("dotenv").config()
const fetch = require("node-fetch")

const searchTerm = "Everlast - What it's like"

const bLog = true
const maxResults = 20
const encodedSearchStr = encodeURI(searchTerm)

let url = `https://www.googleapis.com/youtube/v3/search`
url    += `?part=snippet&maxResults=${maxResults}`
url    += `&q=${encodedSearchStr}`
url    += `&type=video&key=${process.env.YT_KEY}`

if (bLog) console.log(`fetch url: ${url}`)

fetch(url)
    .then(res => res.json())
    .then(data => {
        if (bLog) {
            console.log(
                JSON.stringify(data.items[0],null,4)
            )
        }
        
    })

