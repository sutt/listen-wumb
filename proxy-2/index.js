require('dotenv').config()
const express = require('express')
const cors = require('cors')
const searchRouter = require('./controllers/search-api')
const parseRouter = require('./controllers/parse-api')
const cacheStatsRouter = require('./controllers/cache-stats')

const app = express()

app.use(cors())
app.set('port', process.env.PORT || 3003 )

app.use('/search-yt-api',   searchRouter)
app.use('/parse',           parseRouter)
app.use('/cacheStats',      cacheStatsRouter)


app.listen(app.get('port'), () => {
    console.log(`proxy2 listening on ${app.get('port')}`)
})