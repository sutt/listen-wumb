const {scrapeSite} = require('./main')

const url           = "https://wumb.org/playlist-archives/"
const searchDate    = "20210903"

const cb = (data) => {
    console.log(data)
    console.log(data[data.length-1])
    console.log("this should be Jeremy Garrett (for Sep 3)")
    console.log("run-main script done.")
}

scrapeSite(url, searchDate, cb)


