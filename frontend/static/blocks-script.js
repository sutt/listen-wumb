console.log("hello blocks")

const isDeployed = !window.location.href.includes("localhost")

const urlCacheStatsList = isDeployed 
        ? "https://wumb-proxy-2.herokuapp.com/cacheStats"
        : "http://localhost:3003/cacheStats"

const urlFrontend       = "/alllive"


const renderItem = (item) => {

    let li = document.createElement('li')
    let a  = document.createElement('a')
 
    const link = (`${urlFrontend}?` +
                 `time=${encodeURI(item.minTimeS)}&` + 
                 `date=${encodeURI(item._id)}`
                 )
 
    const text = ( `date: ${item._id} | ` + 
                   `num songs: ${item.countTracks} |` +
                   `from ${item.minTimeS} ` +
                   `to ${item.maxTimeS}`
    )
    a.setAttribute('href', link)
    a.innerText = text
    li.innerHTML = a.outerHTML
    
    return li
}

fetch(urlCacheStatsList)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        
        const div = document.querySelector("#main")

        data.forEach((item) => {
            div.appendChild(renderItem(item))
        })
                
    })