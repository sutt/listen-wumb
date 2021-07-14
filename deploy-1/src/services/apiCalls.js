//Frontend/Views/Script.js in Listen-Wumb repo. Using as template for Video commands
//nothing here is exported 


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
const SCRAPER_LIVE = true
const scraperParam = {SCRAPER_LIVE} ? "?live=true" : "?live=false"

const PROD_ON = true
const scraperEndpoint = {PROD_ON} 
       ? "https://wumb-proxy-2.herokuapp.com/parse" + scraperParam
       : "http://127.0.0.1:3003/parse" + scraperParam

// const bSearcherLive = {SEARCHER_LIVE}

// const bTestingMaxRows = {TESTING_MAXROWS_OFF}

const bSearcherLive = true

const bTestingMaxRows = '1'

const testMaxRows = 5

var playlistDate = document.getElementById("playlistFormDate").value
var playlistTime = document.getElementById("playlistFormTime").value
var scrapeDate   = cvtDateParam(playlistDate)

function timeForm(e) {
e.preventDefault()
const elems = e.target.elements
playlistTime = elems.time.value
playlistDate = elems.date.value
scrapeDate   = cvtDateParam(playlistDate)
console.log(`${playlistTime} | ${playlistDate} | ${scrapeDate}`)
// scrapeArchive()
}

function cvtDateParam(sUserDate) {    

function pad(n, amt=2) {
return (n.toString().length === amt) ? n: `0${n}`
}

const elems = sUserDate.split("-")
if (elems.length !== 3) {
console.log('date not properly formatted in three parts')
}
const attemptCast = new Date(`20${elems[2]}-${pad(elems[0])}-${pad(elems[1])}`)
if (attemptCast.toString() === 'Invalid Date') {
console.log(`bad date - not able to cast`)
}

return `${elems[2]}${pad(elems[0])}${pad(elems[1])}`
}

// video player init



// var vids = ["wDk0eA8HaAg"]
var vids = []

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player
var currentVidIndex = 0

// function onYouTubeIframeAPIReady() {
// player = new YT.Player('player', {
// height: '130', //'270', //'390',
// width:  '240', //'480', //'640',
// // videoId: vids.pop(),
// // host:"https://youtube.com",
// playerVars: {
// // 'autoplay':1,
// 'playsinline': 1,
// 'controls': 0,
// // 'origin': 'http://localhost:4000'
// },
// events: {
// 'onReady': onPlayerReady,
// 'onStateChange': onPlayerStateChange
// }
// });

// }

function nextVideo() {
currentVidIndex ++
player.loadVideoById(vids[currentVidIndex])
player.playVideo()
setHighlightClass()
}

function previousVideo() {
currentVidIndex -- 
player.loadVideoById(vids[currentVidIndex])
player.playVideo()
setHighlightClass()
}

function setVideoIndex(index) {
currentVidIndex = index
player.loadVideoById(vids[currentVidIndex])
player.playVideo()
setHighlightClass()
}

function pauseVideo() {
player.pauseVideo()
console.log("video paused")
}

function playVideo() {
player.playVideo()
console.log("video played")
}


function setHighlightClass(v1=false) {

const trs = document
.getElementById("playlistMain")
.children[0]
.querySelectorAll("tr")

const newInd = v1 ? currentVidIndex * 2 : currentVidIndex
const oldInd = Math.max(-1, (v1 ? (currentVidIndex-1) * 2 : currentVidIndex - 1))

try {
trs[newInd].classList.add("current")
if (oldInd >= 0) trs[oldInd].classList.remove("current")
} catch {
console.log(`not able to update highlightClass for index: ${newInd}`)
}
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
// if (event.data == YT.PlayerState.ENDED) {
// if (currentVidIndex == vids.length - 1)
// currentVidIndex = -1
// nextVideo()
// }
// }


// search yt api ----------------------------

function searchItem(playlistObj) {

const trackInfo = {...playlistObj, date: playlistDate, live: bSearcherLive}

const params = Object.entries(trackInfo)
   .reduce((a,b) => {
       return a + b[0] + "=" + encodeURI(b[1]) + "&"
   }, "?" )

// const url = {PROD_ON}
const url = 'url'

? "https://wumb-proxy-2.herokuapp.com/search-yt-api" + params
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

function setElementValue(elem, scrapedObj, index, maxRes=5) {
// searchItem(buildSearchStr(scrapedObj))
searchItem(scrapedObj)
.then( data => {
console.log(data)
if (data === undefined) {
elem.innerHTML = "<span>No Youtube Results Found</span>"
} else if (data.length < 1) {
elem.innerHTML = "<span>No Youtube Results Found</span>"
} else {

const ytBaseUrl = `https://youtube.com/watch?v=`
const resultIndex = 0
const resultVideoId = data[resultIndex].id.videoId

const linkTag = document.createElement("a")
try {
const src = ytBaseUrl + resultVideoId
linkTag.setAttribute("href", src)
linkTag.innerText = resultVideoId
} catch {}

elem.innerHTML = linkTag.outerHTML
cuePlaylist(data[resultIndex], index)
}
})
}

function buildSearchStr(itemObj) {
const title = itemObj.title.split('(from')[0]
const s =  itemObj.artist + " " + title
return encodeURI(s)
}


function scrapeArchive () {
fetch(scraperEndpoint + `&d=${scrapeDate}`)
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


function cuePlaylist(data, index) {
vids[index] = data.id.videoId
console.log(vids)
if (index === 0) {
setTimeout( () => {
player.loadVideoById(vids[0])
player.playVideo()
setHighlightClass()
}, 2000)
}
}

function timeDiff(t0, t1) {

const baseDate = "2000 january 1"
const d0 = new Date(`${baseDate} ${t0}`)
const d1 = new Date(`${baseDate} ${t1}`)

const deltaMs = d1 - d0
const deltaMins = deltaMs / (1e3 * 60)

return deltaMins
}

function sliceByTime(playlist, sStartTime) {

const tmp = playlist.map(item => {
return {...item, minsAfter: timeDiff(sStartTime, item.time) }
})
.filter(item => item.minsAfter >= 0 )
.sort((a,b) => a.minsAfter - b.minsAfter)

// console.log(tmp)

return tmp
}

function displayPlaylistTable(playlist, v1=false) {
const table = document.createElement("table")
let row     = null
let col     = null

// const bTimeLogic = false
const bTimeLogic = true
if (bTimeLogic) {
playlist = sliceByTime(playlist, playlistTime )
}

if (bTestingMaxRows) {
playlist = playlist.slice(0, Math.min(playlist.length, testMaxRows))
}

playlist.forEach((item, itemIndex) => {

row = document.createElement("tr")
row.classList.add("playlist-row")

col = document.createElement("td")
col.classList.add(`playlist-col`)
col.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 60 60" style="enable-background:new 0 0 60 60;" xml:space="preserve"><g><path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30   c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15   C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z"/><path d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M30,58C14.561,58,2,45.439,2,30   S14.561,2,30,2s28,12.561,28,28S45.439,58,30,58z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>`
col.addEventListener('click', () => {setVideoIndex(itemIndex)})
row.appendChild(col)

const keyNames = ["time", "artist", "title"]
for (let i = 0; i < keyNames.length; i++) {

col = document.createElement("td")
col.classList.add(`playlist-col`)
col.classList.add(`playlist-col-${i}`)
col.innerText = item[keyNames[i]]

row.appendChild(col)
}

if (!v1) {
col = document.createElement("td")
col.classList.add(`playlist-col`)
col.classList.add(`playlist-col-${keyNames.length}`)
col.innerText = "loading..."
setElementValue(col, item, itemIndex)
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
div.innerHTML = ''
div.appendChild(table)
setHighlightClass(v1=v1)


}}


function test(){
    console.log('test working')
}


export default test 