require('dotenv').config()
const fetch = require('node-fetch')
const express = require('express')
const router = express.Router()
const SearchReq = require('../models/search-req')
const SearchRes = require('../models/search-res')
const prt = require('../utils/prt')

const bLog = [] //["testswitch"]

router.get("/", (req, res) => {
    
    let url = null
    if (req.query.live === 'true') {
        url = "http://wumb.org/cgi-bin/playlist1.pl"
    } else {
        url = process.env.NODE_ENV
                    ? "https://wumb-site-mock.herokuapp.com/page"
                    : "http://localhost:3005/page"
    }
    if (req.query.d) {
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

module.exports = router