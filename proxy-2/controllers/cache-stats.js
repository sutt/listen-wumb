const express = require('express')
const router = express.Router()
const SearchReq = require('../models/search-req')
const SearchRes = require('../models/search-res')
const ParseRes = require('../models/parse-res')

const debug = process.env.DEBUG_CACHE_STATS == 'true' ? true : false

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

function getPlaylistInfo(items) {
    
    const infoObj = {}
    const tmpItems = [...items]
    tmpItems.sort((a,b) => a.time - b.time)
    
    infoObj.earliestTime    = tmpItems[0].time
    infoObj.earliestTimeStr = tmpItems[0].timeStr
    infoObj.latestTime      = tmpItems[tmpItems.length-1].time
    infoObj.latestTimeStr   = tmpItems[tmpItems.length-1].timeStr
    infoObj.totalSongs      = tmpItems.length
    
    return infoObj
}


router.get('/parse-detail', (req, res) => {

    const errMsg = (status, msg) => {
        
        if (debug) console.log(msg)
        
        res.status(status).json({errMsg: msg})
    }

    try {
        
        reqDate = new Date(req.query.date)
        
        if (isNaN(reqDate.valueOf())) {
            errMsg(500, `unable to parse date: ${req.query.date}`)
            return
        }     

    } catch (err) {

        errMsg(500, `error on parse date: ${req.query.date}`)
        return
    }
    
    
    ParseRes.findOne({playlistDate: reqDate})
        
        .then(parseDoc => {
            
            if (!parseDoc) {
                errMsg(404, `no parse doc found for date: ${reqDate}`)    
                return
            }

            const infoObj = getPlaylistInfo(parseDoc.items)
            
            infoObj.gaps = getGaps(parseDoc.items, reqDate)
            
            res.json(infoObj)
        })
        .catch(err => {

            errMsg(500, `error on parse-detail: ${err}`)
            return
        })


})


module.exports = router