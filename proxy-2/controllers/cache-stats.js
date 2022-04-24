const express = require('express')
const router = express.Router()
const SearchReq = require('../models/search-req')
const SearchRes = require('../models/search-res')
const ParseRes = require('../models/parse-res')

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


function getGaps(items, playlistDate, intervalMins=30) {
    
    const numIntervals = Math.floor(24*60 / intervalMins)
    const times = items.map(item => item.time)

    const cvtDate = (d) => {
        const output = new Date(d)
        return output
    }
    
    return Array(numIntervals).fill(1).map((v,i) => {
        const [start, end] = [cvtDate(playlistDate),cvtDate(playlistDate)]
        start.setUTCMinutes(   intervalMins*i      )
        end.setUTCMinutes(     intervalMins*(i+1)  )
        return times.some(t => (start < t) && (t < end))
    })

}

router.get('/parse-detail', (req, res) => {

    reqDate = new Date(req.query.date)
    
    if (isNaN(reqDate.valueOf())) {
        res.status(500).json({'errMsg': `unable to parse date: ${decodeQuery?.date}`})
    } 
    
    ParseRes.findOne({playlistDate: reqDate})
        .then(parseDoc => {
            const gapsArray = getGaps(parseDoc.items, reqDate)
            res.json(gapsArray)
        })
        .catch(err => {
            console.log(`err on parse-detail: ${err}`)
            const dummy = Array(24*2).fill(false)
            res.status(500).json(dummy)
        })


})


module.exports = router