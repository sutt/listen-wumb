const fetch = require("node-fetch")
const qs = require('querystring')
//note: put is actually a post in the verbiage below:
const {basicHeaders, putHeaders, putBody, putBodyFieldName} = require('./modules/initials')
const {headersToArray, getSessCookie, obj2Str} = require('./modules/utils')

const searchDate = "20210906"

const debug             = true
const logHtml           = false
const resultTextStdout  = true
const resultTextWriteFS = false

const url = "https://wumb.org/playlist-archives/"


// 1 - GET request to establish session
getToken()                  
.then(sessTokenObj => {
    
    // 2 - POST the searchdate + complementary body fields and session cookie
    return putSearchDate(searchDate, sessTokenObj) 
})
.then(data => {
    
    // 3 - GET request to load playlist HTML
    if (data.status) {
        getSearchResults(data.sessTokenObj)
        .then(text => {    
            
            if (resultTextStdout) {
                console.log(text)
            }    
            //Todo - write to filesystem
        })
    }
})
.finally( () => {
    console.log("script done")    
})


async function getToken() {

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

async function putSearchDate(searchDate, sessTokenObj) {

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
        // console.log(putBodyComplete)
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

async function getSearchResults(sessTokenObj) {
    
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