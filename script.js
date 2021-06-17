console.log("hello js")

const url = "http://127.0.0.1:3000/parse"
let response = null

fetch(url)
    .then(res => {
        res.text()   
            .then(body => {
                
                response = body

                const stage = document.createElement("div")
                stage.innerHTML = body
                
                const tbs = stage.querySelector("#MainContentTextOnly").querySelectorAll("tbody")

                const data = Array.from(tbs).map( tb => {
                    return {
                        time: tb.children[0].innerText.split("\t")[0], 
                        artist: tb.children[0].innerText.split("\t")[1], 
                        title: tb.children[1].innerText
                    }
                })

                console.log(data)
            })
    })
