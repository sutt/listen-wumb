const fetch = require("node-fetch")
const DomParser = require('dom-parser')
const qs = require('querystring')
//note: put is actually a post in the verbiage below:
const {basicHeaders, putHeaders, putBody, putBodyFieldName} = require('./initials')
const {headersToArray, getSessCookie, obj2Str} = require('./utils')

const parser = new DomParser()

const searchDate = "20210903"

const debug             = (process.env.DEBUG_PARSE_MODULES === 'true') 
                          ? true : false
const logHtml           = false
const resultTextStdout  = false
const resultTextWriteFS = false
const allowWrongDate    = (process.env.NODE_ENV === 'prod') 
                          ? false : true     

// const url = "https://wumb.org/playlist-archives/"
// `url` now comes as an argument from parsi-api.js
// this allows it to switch between mocksite and actual


function scrapeSite(url, searchDate, responseCallback, searchDateDate) {
 
    // 1 - GET request to establish session
    getInitialPage(url)                  
    .then(returnData => {
        
        // 2 - POST the searchdate + complementary body fields and session cookie
        return putSearchDate(url, 
                            searchDate, 
                            returnData.sessTokenObj,
                            returnData.formFieldsObj
                            ) 
    })
    .then(data => {
        
        // 3 - GET request to load playlist HTML
        if (data.status) {
            getSearchResults(url, data.sessTokenObj)
            .then(text => {    
                
                if (resultTextStdout) console.log(text)
                    
                const pageDate = parsePlaylistDate(text)

                // allowWrongDate - for sitemock testing where we
                // want to return an example page that probably has the
                // wrong date on it
                if ((pageDate != searchDate) && !allowWrongDate) {
                    
                    console.log(`input searchDate ${searchDate} does not pageDate ${pageDate}`)
                
                } else {
                
                    const jsonData = parsePlaylistHtml(text)    
                    responseCallback(jsonData, searchDateDate)
                }
                
                //Todo 
                // - write to filesystem
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

function parseFormFields(text) {
    
    try {
        let formFieldsObj = {}
        const doc = parser.parseFromString(text)
        const hiddens = doc.getElementsByClassName("acf-hidden")[0]
                            .getElementsByTagName("input")
        
        Array.from(hiddens).forEach(htmlElem => {
            try {
                formFieldsObj[htmlElem.getAttribute("name")] = 
                    htmlElem.getAttribute("value")
            } catch {}
        })
        
        return formFieldsObj

    } catch {
        
        console.log("error in parseFormFields")
        return null
    }
}

function parsePlaylistDate(text) {
    const doc = parser.parseFromString(text)
    return doc.getElementById("acf-field_5e4bac0c25353")
            .getAttribute("value")

}

async function getInitialPage(url) {

    // this will be filled in with relevant return data
    // in multiple .then clauses
    let pageData = {}
    
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

        pageData['sessTokenObj'] = sessTokenObj
        
        if (debug) {
            console.log(`response is ok? ${res.ok}`)
            console.log(`sessTokenObj: ${JSON.stringify(sessTokenObj)}`)
            // console.log(headersArr)
        }

        return res.text()
    })
    .then(text => {
        
        if (logHtml) console.log(text)

        const formFieldsObj = parseFormFields(text)

        pageData['formFieldsObj'] = formFieldsObj

        if (debug) {
            console.log(`formFieldsObj: ${JSON.stringify(formFieldsObj)}`)
        }

        return pageData
        
    })

}

async function putSearchDate(url, searchDate, sessTokenObj, formFieldsObj) {

    // add session toekn as cookie
    const headersAndSessCookie = putHeaders
    headersAndSessCookie['cookie'] = obj2Str(sessTokenObj)
    
    const putBodyComplete = putBody
    putBodyComplete[putBodyFieldName] = searchDate
    
    // two fields are nec to load dynamically from initial page get
    // they change roughly daily (?) the other fields remain static.
    // these added fields are already encoded to x-www
    putBodyComplete['_acf_nonce'] = formFieldsObj._acf_nonce
    putBodyComplete['_acf_form']  = formFieldsObj._acf_form
    
    // endpoint only accepts body as x-www-urlencoded
    // add in search date via object indexing then
    // change the body back into encoded string form
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