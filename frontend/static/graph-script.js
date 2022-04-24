console.log("graph script!")

let url = "http://localhost:3003/cacheStats/parse-detail?date=2022-04-08"

const inputDate = new Date("2022-04-08")
let dateUTC = new Date()
dateUTC.setDate(inputDate.getDate())
// dateUTC.setUTCHours(0,0,0,0)
console.log(dateUTC)

getData(url, dateUTC)


function getData(url, dateUTC) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            renderGraphHeader(dateUTC)
            renderGraph(data)

        })
}


function clearRender() {
    const slotOutline = document.querySelector('.slot-outline')
    const timeLabelOutline = document.querySelector('.time-label-outline')
    slotOutline.innerHTML = ""
    timeLabelOutline.innerHTML = ""
}
function renderGraphHeader(dateUTC) {
    
    const headerDate = document.querySelector('.header-date')
    const totalSongsInfo = document.querySelector('.total-songs-info')
    const earliestSongInfo = document.querySelector('.earliest-song-info')
    const latestSongInfo = document.querySelector('.latest-song-info')
    
    console.log(dateUTC)
    console.log(dateUTC.toDateString())

    headerDate.innerText = dateUTC.toUTCString().split(" ").slice(0,4).join(" ")

    // totalSongsInfo.innerText = `${data.length}`

    
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