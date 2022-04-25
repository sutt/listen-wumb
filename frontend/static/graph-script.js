console.log("graph script!")

let url = "http://localhost:3003/cacheStats/parse-detail?date=2022-04-08"

const inputDate = new Date("2022-04-08")
let dateUTC = new Date()
dateUTC.setDate(inputDate.getDate())
console.log(dateUTC)


getData(url, dateUTC)


function getData(url, dateUTC) {
    
    let err = false
    let errMsg = null
    
    fetch(url)
        
        .then(res => {
            
            if (res.status == 500) {
                err = true
                errMsg = "Internal Server Error"
            }

            if (res.status_code == 404) {
                err = true
                errMsg = "Not Found"
            }
            
            return res.json()
        })
        .then(data => {
            
            console.log(data)

            renderGraphHeader(dateUTC, data)

            if ((err) || (!data?.gaps)) {
                
                displayError(data.errMsg)

            } else {
                
                renderGraph(data.gaps)
            }

        })
}


function clearRender() {
    const slotOutline = document.querySelector('.slot-outline')
    const timeLabelOutline = document.querySelector('.time-label-outline')
    const errorBody = document.querySelector('.error-body')
    slotOutline.innerHTML = ""
    timeLabelOutline.innerHTML = ""
    errorBody.style.display = "none"
}

function displayError(msg) {
    console.log("display error")
    const errorBody = document.querySelector('.error-body')
    const errorMsg = document.querySelector('.error-message')
    // errorMsg.innerText = msg
    errorBody.style.display = "block"
}

function renderGraphHeader(dateUTC, infoObj) {
    
    const headerDate = document.querySelector('.header-date')
    const totalSongsInfo = document.querySelector('.total-songs-info')
    const earliestSongInfo = document.querySelector('.earliest-song-info')
    const latestSongInfo = document.querySelector('.latest-song-info')
    
    console.log(dateUTC)
    console.log(dateUTC.toDateString())

    headerDate.innerText = dateUTC.toUTCString().split(" ").slice(0,4).join(" ")

    totalSongsInfo.innerText    = ""
    earliestSongInfo.innerText  = ""
    latestSongInfo.innerText    = ""

    if (infoObj?.totalSongs)        totalSongsInfo.innerText = infoObj.totalSongs
    if (infoObj?.earliestTimeStr)   earliestSongInfo.innerText = infoObj.earliestTimeStr
    if (infoObj?.latestTimeStr)     latestSongInfo.innerText = infoObj.latestTimeStr
}

    


function renderGraph(data) {
    
    const slotOutline = document.querySelector('.slot-outline')
    const timeLabelOutline = document.querySelector('.time-label-outline')

    for (let i=0; i < data.length; i++) {

        var div = document.createElement('div')
        div.classList.add("time-slot")
        if (!data[i]) div.classList.add("empty")
        slotOutline.appendChild(div)

        if (i % 6 == 0) {
            var label = document.createElement('div')
            label.classList.add("time-label-slot")
            label.innerText = `${i/2}:00`
            timeLabelOutline.appendChild(label)
        }

        if (i == data.length - 1) {
            var label = document.createElement('div')
            label.classList.add("time-label-slot")
            label.innerText = `24:00`
            timeLabelOutline.appendChild(label)
        }

    }
}