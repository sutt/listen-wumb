require("dotenv").config()
const fetch = require("node-fetch")

const searchTerm = "cat clips"

const bLog = true
const maxResults = 20
const encodedSearchStr = encodeURI(searchTerm)

let url = `https://www.googleapis.com/youtube/v3/search`
url    += `?part=snippet&maxResults=${maxResults}`
url    += `&q=${encodedSearchStr}`
url    += `&videoDuration=short`
url    += `&type=video&key=${process.env.YT_KEY}`

if (bLog) console.log(`fetch url: ${url}`)

fetch(url)
    .then(res => res.json())
    .then(data => {
        if (bLog) {
            console.log(
                JSON.stringify(data,null,4)
            )
        }
        
    })

