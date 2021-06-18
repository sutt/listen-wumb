const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.set('port', process.env.PORT || 3005 )


app.get("/page", (req, res) => {
    res.sendFile(
        'playlist1.html',
        {root: __dirname}
    )
})

app.get("/ytmock", (req, res) => {
    mockData = ["abcdefg", "xxxxxxx", "99problems"]
    // mockResponse = Array(10).fill(mockData)
    setTimeout(() => {
        res.json({items:mockData, extraArg: 22})    
    }, Math.random()*5000);
})

app.listen(app.get('port'), () => {
    console.log(`proxy1 listening on ${app.get('port')}`)
})