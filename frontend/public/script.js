console.log("hello js")

const url = "http://127.0.0.1:3000/parse"

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
    playlist.forEach(item => {
        row = document.createElement("tr")
        for (key of ["time", "artist", "title"]) {
            col = document.createElement("td")
            col.innerText = item[key]
            row.appendChild(col)
        }
        table.appendChild(row)
    })
    const div = document.getElementById("playlistMain")
    div.appendChild(table)
    

}

scrapeArchive()

