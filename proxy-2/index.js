require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')
const SearchReq = require('./models/search-req')

const app = express()

// const bLog = []
// const bLog = ['testswitch']
// const bLog = ['mockgoose']
const bLog = ['all']

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
        return  fetch(url)
            .then(res => res.json())
            .then(data => {
                if (bLog.includes("all")) console.log(url)
                return data
            })
            .catch( err => {
                console.log(`cant search for item: ${err}`)
                return undefined
            })
    } catch {
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

    //Check if Songs is Cached
    //pattern:  - must pass multiple checks - to return cached result
    function checkCached() {
        let cachedFound = false
        SearchReq.find({songTitle: decodeQuery.title, songArtist })
        // SearchReq.find({scrapeDateTime: concatQueryDateTime(decodeQuery.time, decodeQuery.date) })
            .then((reqResults) => {  
                
                // TODO - check if reqResults.length > 0
                // TODO - check if `requestResponseValid` is true
                
                if (reqResults) {
                    
                    // attempt to return cached results

                    if (bLog.includes("mockgoose")) console.log(`reqResults: ${reqResults}`)

                    const linkedResponseId = reqResults[0]?.requestResponse?._id
                    if (linkedResponseId) {
                        SearchRes.findById(linkedResponseId)
                            .then((resResults) => {
                                if (resResults) {     // TODO - check if resResults.length > 0
                                    
                                    // all checks pass - return cached result
                                    cachedFound = true

                                    if (bLog.includes("mockgoose")) {
                                        console.log(`returning cahced response: ${resResponse[0]}`)
                                    }

                                    res.json(resResponse[0].items)
                                }
                            })
                            .catch(err => {
                                if (bLog.includes("mockgoose")) {
                                    console.log(`err on SearchRes lookup for id: ${linkedResponseId}\n${err}`)
                                    //TODO - return an error here to hit finally?
                                }
                            })
                    }
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

    function externalSearch() {
        let bSuccess = false
        searchItem(buildSearchStr(decodeQuery), live)
            .then(data => {
                res.json(data.items)
                bSuccess = true
                return data
            })
            .catch(err => {
                console.log(`err in exteralSearch of yt-search-api. live: ${live}\nquery: ${decodeQuery}\nerr: ${err}`)
                res.json([])
            })
            .finally((data) => {
                // does this hit from each branch?
                //TODO - add database write here for result
                if (bSuccess) {
                // SearchRes.create()
                // SearchReq.create()
                }

            })

    }

    if (false) checkCached()        //TODO - enable when ready
    if (true)  externalSearch()     //TODO - disable when ready
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