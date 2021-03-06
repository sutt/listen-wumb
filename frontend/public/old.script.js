console.log("hello js")

const url = "http://127.0.0.1:3004/parse"

// configure testing / dev params
bTesting = true
ytMockURL = "http://127.0.0.1:3005/ytmock"
testMaxRows = 5


function searchItem(searchStr) {

    const bLog = false
    const maxResults = 20

    let url = `https://www.googleapis.com/youtube/v3/search`
    // if (bTesting) url = ytMockURL
    url    += `?part=snippet&maxResults=${maxResults}`
    url    += `&q=${searchStr}`
    url    += `&type=video&key={{YT_KEY}}`

    try {
        return  fetch(url)
            .then(res => res.json())
            .then(data => {
                return data.items
            })
            .catch( err => {
                console.log(`cant search for item: ${err}`)
            })
    } catch {
        return
    }
}

function setElementValue(elem, scrapedObj) {
    searchItem(buildSearchStr(scrapedObj))
    .then( data => {
        console.log(data)
        if (data === undefined) {
            elem.innerHTML = "<span>No Youtube Results Found</span>"
        } else if (data.length < 1) {
            elem.innerHTML = "<span>No Youtube Results Found</span>"
        } else {
            // list up to 5 possilbe you tube videos
            const listTag = document.createElement("ul")
            const ytBaseUrl = `https://youtube.com/watch?=`
            for (let i=0; i < Math.min(5, data.length); i++) {
                const itemTag = document.createElement("li")
                const linkTag = document.createElement("a")
                try {
                    const src = ytBaseUrl + data[i]
                    linkTag.setAttribute("href", src)
                    linkTag.innerText = src
                    itemTag.innerHTML = linkTag.outerHTML
                    listTag.appendChild(itemTag)

                } catch {}
            }
            elem.innerHTML = listTag.outerHTML
            
        }
    })
}

function buildSearchStr(itemObj) {
    const title = itemObj.title.split('(from')[0]
    const s =  itemObj.artist + " " + title
    return encodeURI(s)
}


function scrapeArchive () {
    fetch(url)
    .then(res => {
        res.text()   
            .then(body => {

                const parser = new DOMParser()
                const doc = parser.parseFromString(body, 'text/html')
                const tbs = doc.querySelector("#MainContentTextOnly").querySelectorAll("tbody")

                const data = Array.from(tbs).map( tb => {
                    return {
                        time: tb.children[0].children[0].innerText.replaceAll("\n", ""), 
                        artist: tb.children[0].children[1].innerText.replaceAll("\n", ""), 
                        title: tb.children[1].innerText.replaceAll("\n", "")
                    }
                })

                console.log(data)
                
                displayPlaylistTable(data)
            })
    })
}


function displayPlaylistTable(playlist) {
    const table = document.createElement("table")
    let row     = null
    let col     = null
    if (bTesting) {
        playlist = playlist.slice(0, testMaxRows)
    }
    playlist.forEach(item => {
        
        row = document.createElement("tr")
        for (key of ["time", "artist", "title"]) {
            col = document.createElement("td")
            col.innerText = item[key]
            row.appendChild(col)
        }
        table.appendChild(row)
        
        row = document.createElement("tr")
        col = document.createElement("td")
        col.innerText = "loading..."
        setElementValue(col, item)
        row.appendChild(col)
        table.appendChild(row)
    })
    const div = document.getElementById("playlistMain")
    div.appendChild(table)
    

}

scrapeArchive()

