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
        {root: __dirname + '/old-wumb-pages/'}
    )
})

let postSearchDate = '210928'

app.get("/page-new", (req, res) => {
    
    const availablePages = ['210928', '210901']
    
    const fn = availablePages.includes(postSearchDate)
                ? `${dParam}.html`
                : `210928.html`
    
    res.sendFile(
        fn,
        {root: __dirname + '/new-wumb-pages/'}
    )
})

app.put("/page-new", (req, res) => {
    postSearchDate = req.body['acf[field_5e4bac0c25353]']
    res.send("ok")
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