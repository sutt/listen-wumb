
const mongoose = require('../db/connection')

const DemoRefSchema = new mongoose.Schema(
    {
        x: {type: String},
        y: {type: Object},
        z: {type: Boolean},
    }
)

const DemoSchema = new mongoose.Schema(
    {
        a: {type: String},
        b: {type: String},
        c: {type: Boolean},
        d: {type: mongoose.Schema.Types.ObjectId,
            ref: 'DemoRef',
        },
        e: {type: Number},
        f: {type: mongoose.Schema.Types.Date},
    }
)

const Demo = mongoose.model('Demo', DemoSchema)
const DemoRef = mongoose.model('DemoRef', DemoRefSchema)

const demoSeeds = [
    {
        a:"apple",
        b:"brianna",
        e:22,
        f: new Date('2000-1-1 1:00 pm')
    },
    {
        a:"apple",
        b:"butter",
        e: 33, 
        f: new Date('2000-1-1 2:00 pm')
    },
    {
        a:"apple",
        e:10,
        f: new Date('2000-1-1 10:00 am')
    },
    {
        a:"korea",
        c:true,
        e:99,
    }
]

const demoObj = {
    level1: {
        level2a: 1,
        level2b: false,
        level2c: "hey",
        level2d: [4,5,11],
        level2e: {
            level3a: 1,
            level3b: 2,
        }
    }
}

const demoRefSeeds = [
    {
        x: JSON.stringify(demoObj),
        y: demoObj,
        z: true,
    },
    {
        x: "Ref2",
        y: "ff116609",
        z: false,
    },
]

prt = (o) => JSON.stringify(o)
prty = (o) => JSON.stringify(o, null, 4)

var g1 = null
var g2 = null

DemoRef.deleteMany({})
    .then(() => {
        DemoRef.insertMany(demoRefSeeds)
            .then((output) => {
                seedPartTwo(output)
            })

    })
function seedPartTwo(refSeedsArr) {

    const sample = (arr) => arr[Math.floor(Math.random() * arr.length)]

    Demo.deleteMany({})
        .then(() => {
            const augDemoSeeds = demoSeeds.map(item => {
                return {...item, d: sample(refSeedsArr)}
            })
            Demo.insertMany(augDemoSeeds)
                .then((output) => {
                    console.log(`seeds created:\n${prty(output)}\n`)
                    return output
                })
                .then((output) => {
                    const arrIds = output.map(item => item._id).slice(0,2)
                    const findCondition = {_id: {"$in": arrIds}}
                    return Demo.aggregate([
                        {$group: {
                            _id: "$a", 
                            
                            minE:  {$min: "$e"},
                            maxE:  {$max: "$e"},
                            sumE:  {$sum: "$e"},

                            minF:  {$min: "$f"},
                            maxF:  {$max: "$f"},

                            count: {$sum: 1},
                        }}
                        ])
                        .then((results) => {
                            console.log(`find for ${prt(findCondition)}:\n${prty(results)}\n`)
                            console.log(results[1].maxF.getTime())
                        })
                })
                .then(() => {
                    const findCondition = {a:"apple"}
                    return Demo.find(findCondition, {_id:0})
                        .then((results) => {
                            console.log(`find no id for ${prt(findCondition)}:\n${prty(results)}\n`)
                        })
                })
                // .then(() => {
                //     const findCondition = {a:"not there", e:1}
                //     return Demo.find(findCondition)
                //         .then((results) => {
                //             console.log(`find for ${prt(findCondition)}:\n${prty(results)}\n`)
                //         })
                // })
                .then(() => {
                    process.exit()
                })
        })     
}