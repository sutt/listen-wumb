const SearchReq = require('./search-req')

SearchReq.find({})
    .then(results => {
        console.log(results)
        
    })


var title = "MyTitle"
var artist = "MyArtist"
var date = new Date("2000-1-1")
var resValid = true

var doc = {
    songTitle: title,
    songArtist: artist,
    requestDateTime: date,
    requestResponseValid: resValid,
}

SearchReq.create(doc)
    .then(output => {
        console.log(output)       
    })

