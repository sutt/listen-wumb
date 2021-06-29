require("dotenv").config()
const fetch = require("node-fetch")
const fs = require('fs')

const searchTerm = "iris dement let the mystery be"

const bLog = false
const bWriteOut = true
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
            console.log(JSON.stringify(data,null,4))
        }

        if (bWriteOut) {

            const DATA_DIR = './'
            const jsonFiles = fs.readdirSync(DATA_DIR).filter(fn => fn.includes(".json"))
            const fnNums    = jsonFiles.map(fn => parseInt(fn.split('res')[1].split('.')[0]))
            const maxNum    = Math.max(...fnNums)

            const fn        = `${DATA_DIR}res${maxNum + 1}.json`

            fs.writeFileSync(fn, JSON.stringify(data, null, 4))
            
            console.log(`output file to: ${fn}`)
        }
        
    })

