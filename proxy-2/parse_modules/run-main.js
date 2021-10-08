const {scrapeSite} = require('./main')

const url           = "https://wumb.org/playlist-archives/"
const searchDate    = "20210903"

const cb = (data) => {
    console.log(data)
    console.log("run-main script done.")
}

scrapeSite(url, searchDate, cb)


