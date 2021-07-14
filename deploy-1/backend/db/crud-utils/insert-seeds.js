const fs = require('fs')
const makeFn = require('../../utils/makeFn')
const stripKeys = require('../../utils/stripKeys')
const SearchReq = require('../../models/search-req')
const SearchRes = require('../../models/search-res')

/* 
    take seed json files and insert them into the database

        we pass in Res first and change the objectIds associated 
        in the Req documents under the `requestResponse` field.

*/

const fnReq = '../seeds/search-req-seeds-1.json'
const fnRes = '../seeds/search-res-seeds-1.json'

const seedReq = JSON.parse(fs.readFileSync(fnReq))
const seedRes = JSON.parse(fs.readFileSync(fnRes))

const origResIds = seedRes.map(item => item._id)
const inputSeedRes = seedRes.map(resItem => stripKeys(resItem, ['_id']))
// console.log(inputSeedRes)

SearchRes.insertMany(inputSeedRes)
    .then(data => {
        
        console.log(`inserted ${data.length} seeds to SearchRes`)
        
        const resIdMap = {}
        
        data.forEach((newItem, i) => {resIdMap[origResIds[i]] = newItem._id})

        const inputSeedReq = seedReq.map(item => {
            const tmp = {...item}
            tmp.requestResponse = resIdMap[item.requestResponse]
            return tmp
        })

        SearchReq.insertMany(inputSeedReq)
            .then(data => {
                
                console.log(`inserted ${data.length} seeds to SearchReq`)
                
            })
            .catch(console.err)
            .finally(() => {
                process.exit()
            })
    })
    .catch(console.err)