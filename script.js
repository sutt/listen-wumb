console.log("hello js")

const url = "http://127.0.0.1:3000/parse"

fetch(url)
    .then(res => {
        response = res   
        // console.log(res)
        // console.log(res.body)
    })
