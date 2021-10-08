//findings:
//the `dom-parser` is the one that works
// need to use .innerHTML instead of .innerText

const fetch = require('node-fetch')
const DomParser = require('dom-parser')
const parser = new DomParser()
// const parse = require('html-dom-parser') // this one doesnt work


const url = "http://localhost:3005/page-new"

fetch(url)
    .then(res => {
        return res.text()
    })
    .then(text => {
        // console.log(text)
        // try {
        //     const p = parse(text)    
        //     var items = p.getElementsByClassName("playlist_grid")[0]
        //                     .getElementsByClassName("playlist_grid_item")
        //     console.log(items)
        //     console.log("first one worked!")
        // } catch {
        //     console.log("first one didnt work")
        // }
        
        try {
            const p2 = parser.parseFromString(text)
            var items = p2.getElementsByClassName("playlist_grid")[0]
                            .getElementsByClassName("playlist_grid_item")
            console.log(items)
            console.log("second one worked!")
            
        } catch {
            console.log("second one didnt work")
            
        }
        try {
            const p3 = parser.parseFromString(text)
            var items = p3.getElementsByClassName("playlist_grid")[0]
                            .getElementsByClassName("playlist_grid_item")
            
            for (var i of items) {
                console.log(i.innerHTML)
                
            }
            const data = Array.from(items).map( e => {
                return {
                    time:   e.getElementsByClassName("playlist_item_date")[0].innerHTML,
                    artist: e.getElementsByClassName("playlist_item_artist")[0].innerHTML,
                    title:  e.getElementsByClassName("playlist_item_song")[0].innerHTML,
                }
            })
            console.log(data)
            
            console.log("third one worked!")
            
        } catch {
            console.log("second one didnt work")
            
        }
        
        
    })
console.log("done")

