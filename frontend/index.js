require('dotenv').config()
const express = require('express')
const app = express()

const bLog = true
app.use(express.static('public'))
app.set('view engine', 'hbs')
app.set('port', process.env.PORT || 4000 )

app.get("/test", (req, res) => {
    const data = {ok: true}
    res.json(data)
})


app.get("/", (req, res) => {
    res.sendFile(
        'index.html',    
        {root: __dirname + '/static/'}
    )
})
console.log(process.env.YT_KEY)

app.get("/script.js", (req, res) => {
    res.render('script.hbs', {YT_KEY:process.env.YT_KEY})
})

app.listen(app.get('port'), () => {
    console.log(`frontend listening on ${app.get('port')}`)
})