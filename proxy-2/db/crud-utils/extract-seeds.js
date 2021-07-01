const fs = require('fs')
const makeFn = require('../utils/makeFn')
const SearchReq = require('../models/search-req')
const SearchRes = require('../models/search-res')

const maxDocuments = 100
const outputDirectory = '../seeds/'

/*
    extract documents from db into json files.

        - will write files to db/seeds/ directory: 
                
                search-req-seeds-<N>.json   (from SearchReq collection)
                search-res-seeds-<N>.json   (from SearchRes collection)

                where <N> is a unique number

        - will take a maximum of `maxDocuments` unless its undefined
        
        - strips ObjectId from both types of documents (?)
*/

// TODO - test cwd from different files
// TODO - how will we deal with a new id for insertion of response and linking?
//          - we'll remove the _id field before insertion
//          - we can create a mapping table

const fnReq = makeFn('search-req-seeds', outputDirectory)
const fnRes = makeFn('search-res-seeds', outputDirectory)

SearchReq.find({}, {_id:0})
    .then(data => {
        
        const outputReqData = data.slice(0, maxDocuments)

        const outputResIds = outputReqData.map(reqItem => reqItem.requestResponse)
        
        fs.writeFileSync(fnReq, JSON.stringify(outputReqData, null, 4))

        console.log(`wrote ${outputReqData.length} Req documents to ${fnReq}`)

        SearchRes.find({_id : { $in: outputResIds}}, {_id:0})
            .then(data => {

                fs.writeFileSync(fnRes, JSON.stringify(data, null, 4))

                console.log(`wrote ${data.length} Res documents to ${fnRes}`)

            })
            .then( () => {
                process.exit()
            })

    })



