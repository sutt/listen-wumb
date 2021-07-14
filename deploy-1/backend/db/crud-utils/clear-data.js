const SearchReq = require('../../models/search-req')
const SearchRes = require('../../models/search-res')

SearchReq.deleteMany({})
    .then(msg => {
        console.log(`SearchReq cleared: ${msg}`)
        SearchRes.deleteMany({})
            .then(msg => {
                console.log(`SearchRes cleared: ${msg}`)
            })
            .then(() => {
                process.exit()
            })
    })

