const fetch = require("node-fetch")
const DomParser = require('dom-parser')
const qs = require('querystring')
//note: put is actually a post in the verbiage below:
const {basicHeaders, putHeaders, putBody, putBodyFieldName} = require('./initials')
const {headersToArray, getSessCookie, obj2Str} = require('./utils')

const parser = new DomParser()

const searchDate = "20210903"

const debug             = true
const logHtml           = false
const resultTextStdout  = false
const resultTextWriteFS = false

// const url = "https://wumb.org/playlist-archives/"
// `url` now comes as an argument from parsi-api.js
// this allows it to switch between mocksite and actual

// 1 - GET request to establish session
function scrapeSite(url, searchDate, responseCallback) {
 
    getToken(url)                  
    .then(sessTokenObj => {
        
        // 2 - POST the searchdate + complementary body fields and session cookie
        return putSearchDate(url, searchDate, sessTokenObj) 
    })
    .then(data => {
        
        // 3 - GET request to load playlist HTML
        if (data.status) {
            getSearchResults(url, data.sessTokenObj)
            .then(text => {    
                
                if (resultTextStdout) {
                    console.log(text)
                }    
                
                const jsonData = parsePlaylistHtml(text)
                
                responseCallback(jsonData)
                
                //Todo 
                // - write to filesystem
                // - parse the html to playlist json
                // - add the data to database collection
            })
        }
    })
    .finally( () => {
        if (debug) console.log("scrapeSite done, response returned")    
    })
}

function parsePlaylistHtml(text) {
    
    try {

        const doc = parser.parseFromString(text)
        
        const items = doc.getElementsByClassName("playlist_grid")[0]
                         .getElementsByClassName("playlist_grid_item")

        const data = Array.from(items).map( e => {
            return {
                time:   e.getElementsByClassName("playlist_item_date")[0].innerHTML,
                artist: e.getElementsByClassName("playlist_item_artist")[0].innerHTML,
                title:  e.getElementsByClassName("playlist_item_song")[0].innerHTML,
            }
        })

        return data
    
    } catch {
        
        // if the date did not contain any data it's wrong
        return null
    
    }

}

async function getToken(url) {

    return await fetch(
        url, 
        {
            "headers": basicHeaders,
            "body": null,
            "method": "GET",
        }
    )
    .then(res => {
        
        const headersArr = headersToArray(res)
        const sessTokenObj = getSessCookie(headersArr)
        
        if (debug) {
            console.log(`response is ok? ${res.ok}`)
            console.log(`sessTokenObj: ${JSON.stringify(sessTokenObj)}`)
            console.log(headersArr)
        }
        
        if (logHtml) {
            res.text().then(text => console.log(text))
        }

        return sessTokenObj
    })

}

async function putSearchDate(url, searchDate, sessTokenObj) {

    // add session toekn as cookie
    const headersAndSessCookie = putHeaders
    headersAndSessCookie['cookie'] = obj2Str(sessTokenObj)
    
    // endpoint only accepts body as x-www-urlencoded
    // add in search date via object indexing then
    // change the body back into encoded string form
    const putBodyComplete = putBody
    putBodyComplete[putBodyFieldName] = searchDate
    const putBodyCompleteEncoded = qs.encode(putBodyComplete)

    if (debug) {
        // console.log(headersAndSessCookie)
        console.log(putBodyCompleteEncoded)
    }

    return await fetch(
        url, 
        {
            "headers":  headersAndSessCookie,
            "body":     putBodyCompleteEncoded,
            "method":   "POST",
        }
    )
    .then(res => {
        
        if (debug) {
            console.log(`POST comes back with status ok? ${res.ok}`)
            
        }
        return {status: res.ok, sessTokenObj: sessTokenObj}
    })

}

async function getSearchResults(url, sessTokenObj) {
    
    const headersAndSessCookie = basicHeaders
    headersAndSessCookie['cookie'] = obj2Str(sessTokenObj)

    return await fetch(
        url, 
        {
            "headers":  headersAndSessCookie,
            "body":     null,
            "method":   "GET",
        }
        )
        .then(res => {
            if (debug) {
                console.log(`second GET has ok response? ${res.ok}`)
            }
            if (res.ok) {
                return res.text()
            } else {
                return "second get has bad response; res.ok=false"
            }
        })
}

module.exports = {scrapeSite}