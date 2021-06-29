const express = require('express')
const cors = require('cors')
const fs = require('fs')
const app = express()

app.use(cors())
app.set('port', process.env.PORT || 3005 )

// load jsons fro mock yt-search
const DATA_DIR = './yt-mock-data'
let   YT_DATA  = []
jsonFiles = fs.readdirSync(DATA_DIR)
jsonFiles = jsonFiles.filter(fn => fn.includes(".json"))
jsonFiles.forEach( fn => {
    YT_DATA.push(
        JSON.parse(fs.readFileSync(`${DATA_DIR}/${fn}`))
    )
})
const N_DATA = YT_DATA.length

app.get("/page", (req, res) => {
    
    const dParam = req.query?.date
    const availablePages = ['210521', '210522', '210529']
    
    const fn = availablePages.includes(dParam)
                ? `${dParam}.html`
                : `210522.html`
    
    res.sendFile(
        fn,
        {root: __dirname + '/wumb-pages/'}
    )
})

app.get("/ytmock", (req, res) => {
    mockData = ["abcdefg", "xxxxxxx", "99problems"]
    setTimeout(() => {
        res.json({items:mockData, extraArg: 22})    
    }, Math.random()*5000);
})

app.get("/yt-search", (req, res) => {
    
    const ind = Math.floor(Math.random() * N_DATA)
    const data = YT_DATA[ind]
    res.json(data)
})

app.listen(app.get('port'), () => {
    console.log(`proxy1 listening on ${app.get('port')}`)
})