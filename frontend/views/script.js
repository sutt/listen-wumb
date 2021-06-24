
/* ==== FLAG VARIABLES =======
    inserted via handlebars

    PROD_ON             - true to point scraper + search to heroku servers
                          false (default) to point to local servers

    SCRAPER_LIVE        - true to tell proxy to scrape from wumb.org
                          false (default) to tell proxy to scrape from site-mock
    
    SEARCHER_LIVE       - true  will point search at youtube-api 
                          false (default) will point search at site-mock
    
    TESTING_MAXROWS_OFF - true (default) only up to 5 rows
                          false to process/search/view all rows on playlist page
                          
    
    YT_KEY              - api key

   =========================== */

const scraperParam = {{SCRAPER_LIVE}}
                        ? "?live=true"
                        : ""

const scraperEndpoint = {{PROD_ON}} 
                            ? "https://wumb-proxy-2.herokuapp.com/parse" + scraperParam
                            : "http://127.0.0.1:3003/parse" + scraperParam

const bSearcherLive = {{SEARCHER_LIVE}}

const bTestingMaxRows = {{TESTING_MAXROWS_OFF}}

const testMaxRows = 5

const playlistDate = "5-22-2021"


// video player init

// var vids = ["wDk0eA8HaAg"]
var vids = []

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player
var currentVidIndex = 0

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        // videoId: vids.pop(),
        // host:"https://youtube.com",
        playerVars: {
        // 'autoplay':1,
        'playsinline': 1,
        // 'origin': 'http://localhost:4000'
        },
        events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
        }
    });
    
}

function nextVideo() {
    player.loadVideoById(vids.pop())
    player.playVideo()
    currentVidIndex ++
    setHighlightClass()
}

function setHighlightClass(v1=false) {
        
    const trs = document
        .getElementById("playlistMain")
        .children[0]
        .querySelectorAll("tr")
    
    const newInd = v1 ? currentVidIndex * 2 : currentVidIndex
    const oldInd = Math.max(-1, (v1 ? (currentVidIndex-1) * 2 : currentVidIndex - 1))
    console.log(newInd, oldInd)
    
    trs[newInd].classList.add("current")
    if (oldInd >= 0) trs[oldInd].classList.remove("current")
}

function onPlayerReady(event) {
    console.log("player ready")
    // setTimeout(() => {event.target.playVideo();}, 2000)
    // player.loadVideoById("O6Xo21L0ybE")
    setTimeout( () =>  {
        player.pauseVideo()
        console.log("hit play?")
        player.playVideo()
    }, 4000)
}


function onPlayerStateChange(event) {
    console.log(`changed to state: ${event.data}`)
    if (event.data == -1 || event.data == 3) {
        console.log("start it up!")
        player.playVideo()
    }
    if (event.data == YT.PlayerState.ENDED) {
        if (vids.length == 0) return
        player.loadVideoById(vids.pop())
        player.playVideo()
    }
}


// search yt api ----------------------------

function searchItem(playlistObj) {
    
    const trackInfo = {...playlistObj, date: playlistDate, live: bSearcherLive}
    
    const params = Object.entries(trackInfo)
                        .reduce((a,b) => {
                            return a + b[0] + "=" + encodeURI(b[1]) + "&"
                        }, "?" )

    const url = {{PROD_ON}} 
                    ? "http://wumb-proxy-2.herokuapp.com/search-yt-api" + params
                    : "http://localhost:3003/search-yt-api" + params
    try {
        return  fetch(url)
            .then(res => res.json())
            .then(data => {
                return data
            })
            .catch(err => undefined)
    } catch {
        return
    }
}

function setElementValue(elem, scrapedObj, maxRes=5) {
    // searchItem(buildSearchStr(scrapedObj))
    searchItem(scrapedObj)
    .then( data => {
        console.log(data)
        if (data === undefined) {
            elem.innerHTML = "<span>No Youtube Results Found</span>"
        } else if (data.length < 1) {
            elem.innerHTML = "<span>No Youtube Results Found</span>"
        } else {
            // list up to 5 possilbe you tube videos
            const listTag = document.createElement("ul")
            const ytBaseUrl = `https://youtube.com/watch?v=`
            for (let i=0; i < Math.min(maxRes, data.length); i++) {
                const itemTag = document.createElement("li")
                const linkTag = document.createElement("a")
                try {
                    const src = ytBaseUrl + data[i].id.videoId
                    linkTag.setAttribute("href", src)
                    linkTag.innerText = src
                    itemTag.innerHTML = linkTag.outerHTML
                    listTag.appendChild(itemTag)

                } catch {}
            }
            elem.innerHTML = listTag.outerHTML
            cuePlaylist(data[0])
            
        }
    })
}

function buildSearchStr(itemObj) {
    const title = itemObj.title.split('(from')[0]
    const s =  itemObj.artist + " " + title
    return encodeURI(s)
}


function scrapeArchive () {
    fetch(scraperEndpoint)
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


function cuePlaylist(data) {
    vids.push(data.id.videoId)
    console.log(vids)
}

function displayPlaylistTable(playlist, v1=false) {
    const table = document.createElement("table")
    let row     = null
    let col     = null
    if (bTestingMaxRows) {
        playlist = playlist.slice(0, testMaxRows)
    }
    playlist.forEach(item => {
        
        row = document.createElement("tr")
        for (key of ["time", "artist", "title"]) {
            col = document.createElement("td")
            col.innerText = item[key]
            row.appendChild(col)
        }
        
        if (!v1) {
            col = document.createElement("td")
            col.innerText = "loading..."
            setElementValue(col, item, maxRes=1)
            row.appendChild(col)
        }

        table.appendChild(row)
        
        if (v1) {
            row = document.createElement("tr")
            col = document.createElement("td")
            col.innerText = "loading..."
            setElementValue(col, item)
            row.appendChild(col)
            table.appendChild(row)
        }
    })
    const div = document.getElementById("playlistMain")
    div.appendChild(table)
    setHighlightClass(v1=v1)
    

}

scrapeArchive()
