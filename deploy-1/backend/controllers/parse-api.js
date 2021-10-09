require('dotenv').config()
const fetch = require('node-fetch')
const qs = require('querystring')
const express = require('express')
const router = express.Router()
const SearchReq = require('../models/search-req')
const SearchRes = require('../models/search-res')
const prt = require('../utils/prt')
const {scrapeSite} = require('../parse_modules/main')

const debug = true

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


router.get("/", (req, res) => {

    let url = null
    if (req.query.live === 'true') {
        url =         "https://wumb.org/playlist-archives/"
    } else {
        url = process.env.NODE_ENV
                    ? "https://wumb-site-mock.herokuapp.com/page-new"
                    : "http://localhost:3005/page-new"
    }
    
    // if no `d` param in request, get current date
    const incomingSearchDate = req.query.d

    // incoming: YYMMDD - formatted: YYYYMMDD
    const formattedSearchDate = incomingSearchDate 
                ? "20" + incomingSearchDate
                : getFormattedCurrentDate()
                    
    if (debug) {
        console.log(formattedSearchDate)
        console.log(url)
    }

    // back the `res` object, to call `.send` method inside 
    const responseCallback = (text) => {res.json(text)}
    
    scrapeSite(url, formattedSearchDate, responseCallback)

})

module.exports = router