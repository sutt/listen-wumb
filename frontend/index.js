require('dotenv').config()
const express = require('express')
const app = express()

const bLog = true

const defaultTime = "3:31 pm"
const defaultDate = "9-01-21"

app.use(express.static('public'))
app.set('view engine', 'hbs')
app.set('port', process.env.PORT || 4000 )

// hack switches for changing script.js
b_scraper_live      = false
b_searcher_live     = false
b_testing_maxrows_off = true

app.get("/test", (req, res) => {
    const data = {ok: true}
    res.json(data)
})


app.get("/script.js", (req, res) => {
    
    const args = {   
        YT_KEY:             process.env.YT_KEY,
        PROD_ON:            Boolean(process.env.NODE_ENV),
        SCRAPER_LIVE:       b_scraper_live,
        SEARCHER_LIVE:      b_searcher_live,
        TESTING_MAXROWS_OFF:b_testing_maxrows_off,
    }
    
    console.log("serving script.js with args:")
    console.log(args)

    res.render('script.hbs', args)
})

app.get('/blocks-script.js', (req, res) => {
    res.sendFile('blocks-script.js',
                {root: __dirname + '/static/'}
    )
})

app.get('/blocks', (req,res) => {
    
    res.sendFile(
        'blocks.html',    
        {root: __dirname + '/static/'}
    )
})

app.get("/:args", (req, res) => {
    
    if (req.params.args == "home") {
        
        b_scraper_live      = false
        b_searcher_live     = false
    
    } else if (req.params.args == "pagelive") {
        
        b_scraper_live      = true
        b_searcher_live     = false
    
    } else if (req.params.args == "searchlive") {
        
        b_scraper_live      = false
        b_searcher_live     = true
    
    } else if (req.params.args == "alllive") {

        b_scraper_live      = true
        b_searcher_live     = true

    } else {
        res.send(`args: ${req.params.args} not recognized`)
        return
    }
    
    
    const q = Object.fromEntries(
        Object.entries(req.query).map(kv => [kv[0], decodeURI(kv[1])])
    )
    
    const args = {
        paramTime: q.time || defaultTime,  
        paramDate: q.date || defaultDate
    }
    
    res.render('player.hbs', args)
})

app.listen(app.get('port'), () => {
    console.log(`frontend listening on ${app.get('port')}`)
})