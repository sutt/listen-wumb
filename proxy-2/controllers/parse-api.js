require('dotenv').config()
const fetch = require('node-fetch')
const qs = require('querystring')
const express = require('express')
const router = express.Router()
const SearchReq = require('../models/search-req')
const SearchRes = require('../models/search-res')
const ParseRes = require('../models/parse-res')
const prt = require('../utils/prt')
const {scrapeSite} = require('../parse_modules/main')

const debug = process.env.DEBUG_PARSE_API == 'true' ? true : false
let   isMock = process.env.MOCK_PARSE     == 'true' ? true : false    

const pad = (n, amt=2) => (n.toString().length === amt) ? n: `0${n}`

const getFormattedCurrentDate = () => {
    // return current date in YYYYMMDD
    // TODO - enforce this for EST, which will match wumb timing
    return (
            new Date().toLocaleDateString().split("/")[2]  +
        pad(new Date().toLocaleDateString().split("/")[0]) + 
        pad(new Date().toLocaleDateString().split("/")[1]) 
        )
}

const setUTCTimeOnDate = (date, time) => {
    
    try {    
    
        const output = new Date(date)
        output.setUTCHours(0,0,0,0)
        
        const [hour, minuteXm] = time.split(":")
        const [minute, ampm] = minuteXm.split(" ")

        if ((ampm == "am") && (parseInt(hour) !== 12)) {
            output.setUTCHours(parseInt(hour))
        } else if ((ampm == "pm") && (parseInt(hour) !== 12)) {
            output.setUTCHours(parseInt(hour) + 12)
        } else if ((ampm == "pm") && (parseInt(hour) == 12)) {
            output.setUTCHours(parseInt(hour))
        }

        output.setMinutes(minute)
        
        return output
    
    } catch (err) {
    
        return null
    }
}

router.get("/", (req, res) => {

    let url = null
    if (req.query.live === 'true') {
        url =         "https://wumb.org/playlist-archives/"
    } else {
        url = process.env.NODE_ENV
                    ? "https://wumb-site-mock.herokuapp.com/page-new"
                    : "http://localhost:3005/page-new"
        isMock = true
    }
    
    // if no `d` param in request, get current date
    const incomingSearchDate = req.query.d

    // incoming: YYMMDD - formatted: YYYYMMDD
    const formattedSearchDate = incomingSearchDate 
                ? "20" + incomingSearchDate
                : getFormattedCurrentDate()

    const searchDateUTC = new Date(
        formattedSearchDate.slice(0,4),
        parseInt(formattedSearchDate.slice(4,6)) - 1,
        formattedSearchDate.slice(6,8),
    )

    searchDateUTC.setUTCHours(0,0,0,0)
            
    if (debug) {
        console.log(formattedSearchDate)
        console.log(searchDateUTC)
        console.log(url)
    }

    checkCachedParseRes(searchDateUTC)
        
        .then(data => {
    
            if (data) {
                
                if (debug) console.log("found cached result")
                
                res.json(data)

            } else {

                if (debug) console.log("no cached result")
                
                const responseCallback = (playlistData, searchDate) => {
                    res.json(playlistData)
                    writeParseResToCache(playlistData, searchDate)
                }
                
                scrapeSite(url, formattedSearchDate, responseCallback, searchDateUTC)
            }
        })
})

async function checkCachedParseRes(searchDate) {
        
    const searchDatePlusOneDay = new Date()
    searchDatePlusOneDay.setUTCHours(0,0,0,0)
    searchDatePlusOneDay.setDate(searchDate.getDate() + 1)

    const data = await ParseRes.find(
        {
            playlistDate: 
            {
                $gte: searchDate,
                $lt:  searchDatePlusOneDay,
            },
            isMock: isMock,
            complete: true,
        }
        
        )
        
    if (data.length > 0) {
        return data[0].items
        .sort((a,b) => a.time - b.time)
        .map(item => {
            return {
                artist: item.artist,
                title:  item.title,
                time:   item.timeStr,
            }
        }) 
    }
    
    return null
}



function writeParseResToCache(playlistData, searchDate) {

    if (!playlistData) { 
        if (debug) console.log("no playlist data to cache")
        return
    }
    
    playlistData.forEach(item => {
        item.timeStr    = item.time
        item.time       = setUTCTimeOnDate(searchDate, item.time)
    })

    playlistData.sort((a,b) => a.time - b.time)

    try {

        const nowUTC = new Date()
        nowUTC.setUTCHours(0,0,0,0)

        const newParseRes = new ParseRes({
            playlistDate: searchDate,
            searchDate: nowUTC,
            complete: (new Date).getDate() - searchDate.getDate() > 1 ? true: false,
            isMock: isMock,
            items: playlistData,
        })
    

        newParseRes.save()
            .then(data => {
                if (debug) console.log("saved parseRes to cache")
            })
            .catch(err => {
                if (debug) console.log(`err on writeParseResToCache: ${err}`)
            })

    } catch (err) {
        
        if (debug) console.log(`err on writeParseResToCache: ${err}`)
        
        return 
    }

}


module.exports = router