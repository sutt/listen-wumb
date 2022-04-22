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
    try {
        res.sendFile(path.join(__dirname, '../build'), (err) => {
            console.log(`problem sending file, ${err}`)
        })
    } catch {
        res.status(404).send("")
    }
})
app.listen(app.get('port'), () => {
    const envs = [
        'YT_KEY',
        'DEBUG_PARSE_API',
        'DEBUG_PARSE_MODULES',
        'MOCK_PARSE',
    ]
    const envSettings = envs.map(e => `${e}=${process.env[e]}`)
    console.log(`proxy2 running with env's:\n${envSettings.join('\n')}`)
    
    console.log(`proxy2 listening on ${app.get('port')}\n...`)

})