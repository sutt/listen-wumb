const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')
const app = express()

const bLog = true
app.use(cors())
app.set('port', process.env.PORT || 3004 )

app.get("/", (req, res) => {
    const data = {ok: true}
    res.json(data)
})


app.get("/parse", (req, res) => {
    
    // const url = "http://wumb.org/cgi-bin/playlist1.pl"
    const url = "http://localhost:3005/page"

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