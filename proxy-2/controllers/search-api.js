require('dotenv').config()
const fetch = require('node-fetch')
const express = require('express')
const router = express.Router()
const SearchReq = require('../models/search-req')
const SearchRes = require('../models/search-res')
const prt = require('../utils/prt')


const bLog = [] //['mockgoose', 'all']

const ytMockURL = process.env.NODE_ENV == 'prod'
                    ? "https://wumb-site-mock.herokuapp.com/yt-search"
                    : "http://127.0.0.1:3005/yt-search"


function buildSearchStr(itemObj) {
    const title =  itemObj.title.split('(from')[0]
    const s =      itemObj.artist + " " + title
    return encodeURI(s)
}

function searchItem(searchStr, live=false) {
    /*
        input: uri-encoded string to search
    
        returns either:
            - object from yt-api/mock-api
            - undefined if fails
    */

    const maxResults = 20

    let url = live 
                ? `https://www.googleapis.com/youtube/v3/search`
                : ytMockURL
    
    url    += `?part=snippet&maxResults=${maxResults}`
    url    += `&q=${searchStr}`
    // url    += `&videoEmbeddable=true`
    url    += `&type=video&key=${process.env.YT_KEY}`
    

    try {
        return fetch(url)
            .then(res => {
                // if (res.status !== 200) {
                //     console.log(res.body.getReader())
                //       res.status   
                //     return undefined
                // }
                return res
            })
            .then(res => res.json())
            .then(data => {
                if (bLog.includes("all")) console.log(url)
                return data
            })
            .catch( err => {
                console.log(`cant search for item:${url}\n${err}`)
                return undefined
            })
    } catch(err) { 
        console.log(`error on reqeset external search resource:${url}\n${err}`)
        return undefined
    }
}


router.get('/', (req, res) => {
    
    const decodeQuery = Object.fromEntries(
        Object.entries(req.query).map(kv => [kv[0], decodeURI(kv[1])])
    )

    const live =  (decodeQuery?.live === 'true') ? true : false

    checkCached()

    function checkCached() {
        
        let cachedFound = false
        
        SearchReq.find({
            songTitle:  decodeQuery.title, 
            songArtist: decodeQuery.artist,
            })
            .populate('requestResponse')
            .then((reqResults) => {  
                
                if (reqResults && 
                    reqResults.length > 0 && 
                    reqResults[0].requestResponseValid &&
                    reqResults[0].requestResponse._id  &&
                    reqResults[0].requestResponse.response
                    ) {
                    
                    // return cached results
 
                    cachedFound = true
                    const linkedResponse = reqResults[0].requestResponse
                    res.json(linkedResponse.response.items)
                        
                }
            })
            .catch(err => {
                console.log(`err on SearchReq lookup for query: ${decodeQuery.toString()}\n${err}`)
            }) 
            .finally(() => {
                if (!cachedFound) {
                    
                    // cached response not found; request from yt-data

                    externalSearch(
                        true,
                        decodeQuery,
                    )
                }
            })
            
            
    }

    function externalSearch(cacheWrite=true, decodeQuery={}) {
        
        let bSuccess    = false
        let t0          = null
        let t1          = null
        
        let encodedStr = ''
        try {
            encodedStr = buildSearchStr(decodeQuery)
        } catch {
            console.log(`err in buildSearchStr for ${decodeQuery}`)
            res.json([])
            return
        }

        searchItem(encodedStr, live)
            .then(data => {
                
                // measure query write time
                if (bLog.includes("mockgoose")) {
                    t0 = new Date()
                    t0 = t0.getTime()
                }

                // send back response of external search to client
                res.json(data.items)
                
                // determine the success of external search
                // TODO - check response code
                if (data && data.items && data.items.length > 0) {
                    bSuccess = true
                }
                
                return data
            })
            .catch(err => {
                console.log(`err in exteralSearch of yt-search-api. live: ${live}\nquery: ${decodeQuery}\nerr: ${err}`)
                res.json([])
            })
            .then((extData) => {
                
                // cache-ing is turned off at function-level
                if (!cacheWrite) return

                writeResult(extData, decodeQuery, bSuccess)
                
            })
    }

    function writeResult(extData, decodeQuery, bSuccess) {

        SearchRes.create({response: extData})
            .then((searchResObj) => {
                        
                const q = {...decodeQuery}

                let scrapeDateTime = null
                try {scrapeDateTime = new Date(`${q.date} ${q.time}`)} catch {new Date("2000-1-1")}

                let normdArtist = null
                let normdTitle  = null
                let normdAlbum  = null
                try {
                normdArist = q.artist.toLowerCase()
                normdTitle = q.title.split(' (from ')[0].toLowerCase()
                normdAlbum = q.title.split('(from ')[1].split(')')[0].toLowerCase()
                } catch {}
                
                const reqDoc = {

                    songTitle:          q.title,
                    songArtist:         q.artist,
                    songAlbum:          null,
                    
                    normalizedTitle:    normdTitle,
                    normalizedArtist:   normdArtist,
                    normalizedAlbum:    normdAlbum,
                    
                    scrapeTime:         q.time,
                    scrapeDate:         q.date,
                    scrapeDateTime:     scrapeDateTime,
                    
                    requestDateTime:    new Date(),
                    requestResponseValid: bSuccess,
                    requestResponseErrMessage: null,

                    requestResponse:    searchResObj._id

                }
                
                // write the clients request + external-response to the cache
                SearchReq.create(reqDoc)
                    .then((output) => {
                        
                        // logging info about insertion
                        if (bLog.includes("mockgoose")) {
                            t1 = new Date()
                            t1 = t1.getTime()
                            console.log(`inserted document:\n${prt(output)}\n`)
                            console.log(`insertTime - responseTime: ${t1 - t0} ms`)
                        }
                    })
                })

    
    }
    
})

module.exports = router