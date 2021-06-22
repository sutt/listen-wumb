const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')
const app = express()

const bLog = true
app.use(cors())
app.set('port', process.env.PORT || 3003 )

const bTestingUrl = true
const ytMockURL = (process.env.NODE_ENV == 'prod')
                    ? "https://wumb-site-mock.herokuapp.com/yt-search"
                    : "http://127.0.0.1:3005/yt-search"


function buildSearchStr(itemObj) {
    const title = itemObj.title.split('(from')[0]
    const s =  itemObj.artist + " " + title
    return encodeURI(s)
}

function searchItem(searchStr) {
    /*
        input: uri-encoded string to search
    
        returns either:
            - object from yt-api/mock-api
            - undefined if fails
    */

    const bLog = false
    const maxResults = 20

    let url = `https://www.googleapis.com/youtube/v3/search`

    if (bTestingUrl) url = ytMockURL  // TODO - this needs a value
    
    url    += `?part=snippet&maxResults=${maxResults}`
    url    += `&q=${searchStr}`
    url    += `&type=video&key=${process.env.YT_KEY}`

    try {
        return  fetch(url)
            .then(res => res.json())
            .then(data => {
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
    console.log(decodeQuery)

    //Stub - Check if Songs is Cached

    searchItem(buildSearchStr(decodeQuery))
        .then(data => {
            res.json(data.items)
        })
        .catch(err => {
            console.log(err)
            res.json([])
        })
})

app.get("/parse", (req, res) => {
    
    let url = null
    if (req.query.live !== undefined) {
        url = "http://wumb.org/cgi-bin/playlist1.pl"
    } else {
        url = process.env.NODE_ENV
                    ? "https://wumb-site-mock.herokuapp.com/page"
                    : "http://localhost:3005/page"
    }

    fetch(url)
        .then(pageRes => {
            pageRes.text()
                .then(body => {
                    res.send(body)
                    if (bLog) console.log("success server side")
                })
        })
        .catch(err => {
        
            let msg = `error fetching page on proxy\n`
            msg += err
            res.status(404).send(msg)
            
            if (bLog) console.log("error server side")
        
        })

})

app.listen(app.get('port'), () => {
    console.log(`proxy1 listening on ${app.get('port')}`)
})