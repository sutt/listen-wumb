const SearchReq = require('../../models/search-req')
const SearchRes = require('../../models/search-res')

const bJustOne = false
const bShortOutput = false
const maxOutputChars = 300

SearchRes.find({})
    .then(output => {
        console.log(`SearchRes items: ${output.length}`)
        console.log(`displaying ${bJustOne ? 1: output.length} items...`)
        let sOutput = JSON.stringify(output.slice(0,  bJustOne ? 1 : output.length), null, 4)
        if (bShortOutput) sOutput = sOutput.slice(0,maxOutputChars)
        console.log(sOutput)
    })
    .then(() => {
        SearchReq.find({})
            .populate('requestResponse')
            .then(output => {
                console.log(`SearchReq items: ${output.length}`)
                console.log(`displaying ${bJustOne ? 1: output.length} items...`)
                let sOutput = JSON.stringify(output.slice(0,  bJustOne ? 1 : output.length), null, 4)
                if (bShortOutput) sOutput = sOutput.slice(0,maxOutputChars)
                console.log(sOutput)
            })
            .then(() => {
                process.exit()
            })        
    })


