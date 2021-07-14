require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const searchRouter = require('./controllers/search-api')
const parseRouter = require('./controllers/parse-api')
const cacheStatsRouter = require('./controllers/cache-stats')

const app = express()

app.use(cors())
app.use(express.static(path.join(__dirname, '../build')))
app.set('port', process.env.PORT || 3003 )


app.use('/search-yt-api',   searchRouter)
app.use('/parse',           parseRouter)
app.use('/cacheStats',      cacheStatsRouter)


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build'), (err) => {
        console.log(`problem sending file, ${err}`)
    })
})
app.listen(app.get('port'), () => {
    console.log(`proxy2 listening on ${app.get('port')}`)
})