require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')
const SearchReq = require('./models/search-req')
const SearchRes = require('./models/search-res')

const app = express()

// const bLog = []
// const bLog = ['testswitch']
// const bLog = ['all']
const bLog = ['all', 'mockgoose', 'shortprint']
const maxOutputChars = 300

const prt = (o) => {
    if (!bLog.includes("shortprint")) {
        return o
    } else {
        if (typeof o === 'object') {
            return JSON.stringify(o, null, 4).slice(0, maxOutputChars)
        } else {
            return o.slice(0, maxOutputChars)
        }
    }
}


app.use(cors())
app.set('port', process.env.PORT || 3003 )

const ytMockURL = (process.env.NODE_ENV == 'prod')
                    ? "https://wumb-site-mock.herokuapp.com/yt-search"
                    : "http://127.0.0.1:3005/yt-search"


function buildSearchStr(itemObj) {
    const title = itemObj.title.split('(from')[0]
    const s =  itemObj.artist + " " + title
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
    url    += `&type=video&key=${process.env.YT_KEY}`

    try {
        return fetch(url)
            .then(res => res.json())
            .then(data => {
                // TODO - check response code
                if (bLog.includes("all")) console.log(url)
                return data
            })
            .catch( err => {
                console.log(`cant search for item: ${err}`)
                return undefined
            })
    } catch(err) { 
        console.log(`error on reqeset external search resource:\n${err}`)
        return undefined
    }
}



app.get('/search-yt-api', (req, res) => {
    
    const decodeQuery = Object.fromEntries(
        Object.entries(req.query).map(kv => [kv[0], decodeURI(kv[1])])
    )

    const live =  (decodeQuery?.live === 'true') ? true : false
        
    if (bLog.includes("all")) {
        console.log(decodeQuery)
    }
    if (bLog.includes("testswitch")) {
        console.log(`running /search-yt-api ${live ? 'live' : 'dead'}`)
    }

    function checkCached() {
        
        let cachedFound = false
        
        // SearchReq.find({scrapeDateTime: concatQueryDateTime(decodeQuery.time, decodeQuery.date) })
        
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

                    if (bLog.includes("mockgoose")) {
                        console.log(`reqResults: ${prt(reqResults)}`)
                    }
 
                    cachedFound = true
                    
                    const linkedResponse = reqResults[0].requestResponse

                    if (bLog.includes("mockgoose")) {
                        console.log(`\n\nreturning cahced response: ${prt(linkedResponse)}\n\n`)
                    }

                    res.json(linkedResponse.response.items)
                        
                }
            })
            .catch(err => {
                if (bLog.includes("mockgoose")) {
                    console.log(`err on SearchReq lookup for query: ${decodeQuery.toString()}\n${err}`)
                }
            }) 
            .finally(() => {
                if (!cachedFound) {
                    
                    // cahced response not found: some condition above failed, 
                    // do an external resource lookup
                    // and return that result, or an error if it fails

                    if (bLog.includes("mockgoose")) { 
                        console.log("making external resource request")
                    }
                    externalSearch()
                }
            })
            
            
    }

    function externalSearch(cacheWrite=true) {
        
        let bSuccess    = false
        let t0          = null
        let t1          = null
        
        // perform external search
        searchItem(buildSearchStr(decodeQuery), live)
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
                
                if (bLog.includes("mockgoose")) {
                    console.log(`extData: ${prt(extData)}`)
                }
                
                SearchRes.create({response: extData})
                    .then((searchResObj) => {
                        
                        const q = {...decodeQuery}

                        let scrapeDateTime = null
                        try {scrapeDateTime = new Date(`${q.date} ${q.time}`)} catch {}

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

            })
    }

    if (true)   checkCached()
    if (false)  externalSearch(cacheWrite=false)
})

app.get("/parse", (req, res) => {
    
    let url = null
    if (req.query.live === 'true') {
        url = "http://wumb.org/cgi-bin/playlist1.pl"
    } else {
        url = process.env.NODE_ENV
                    ? "https://wumb-site-mock.herokuapp.com/page"
                    : "http://localhost:3005/page"
    }
    if (req.query.d !== undefined) {
        url += `?date=${req.query.d}`
    }
    
    if (bLog.includes("testswitch")) console.log(`fetching parse from ${url}`)
    

    fetch(url)
        .then(pageRes => {
            pageRes.text()      // TODO - no return statement?
                .then(body => {
                    res.send(body)
                })
        })
        .catch(err => {
        
            let msg = `error fetching page on proxy\n`
            msg += err
            res.status(404).send(msg)       
            console.log(`error server side on /parse: ${err}`)
        
        })

})

app.listen(app.get('port'), () => {
    console.log(`proxy2 listening on ${app.get('port')}`)
})