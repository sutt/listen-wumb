console.log("hello js")

const url = "http://127.0.0.1:3000/parse"


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
            })
    })
