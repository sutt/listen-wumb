const express = require('express')
const router = express.Router()
const SearchReq = require('../models/search-req')
const SearchRes = require('../models/search-res')

router.get('/', (req, res) => {
    SearchReq.aggregate([
        {$group: {
            
            _id: "$scrapeDate",
            
            minTime: {$min: "$scrapeDateTime"},
            maxTime: {$max: "$scrapeDateTime"},

            countTracks: {$sum: 1},
        }}
    ])
        .then( aggOutput => {
            
            const pad = (n, amt=2) => {
                return (n.toString().length === amt) ? n: `0${n}`
            }
            const cvtTime = (t) => {
                const th = t.getHours() 
                const h = th > 12 ? th - 12 : th
                const m = t.getMinutes()
                const am = th > 12 ? 'pm' : 'am'
                return `${h}:${pad(m)} ${am}`
            }
            
            const cvtOutput = aggOutput.map(item => {
                const tmp = {...item}
                try {
                tmp.minTimeS = cvtTime(tmp.minTime)
                tmp.maxTimeS = cvtTime(tmp.maxTime)
                } catch {}
                return tmp
            })

            res.json(cvtOutput)
        })
        .catch( err => {
            console.log(`err in cacheStats/ ${err}`)
            res.json([])
        })
})

router.get('/date-detail/:date', (req, res) => {
    SearchReq
        .find({scrapeDate: req.params.date},
             {
                scrapeDate: 1, 
                scrapeTime: 1, 
                scrapeDateTime: 1,
                requestResponseValid: 1,
            }
            )
        // order by time
        .then(reqs => {
            //
            res.json(reqs)

        })
})

module.exports = router