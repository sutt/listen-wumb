const fs  = require('fs')

const backPath      = './backend/package.json'
const frontPath     = './package.json'
const outputPath    = './package.json'

const backPackage  = JSON.parse(fs.readFileSync(backPath))
const frontPackage = JSON.parse(fs.readFileSync(frontPath))

let bothPackage = {
    "name": "app",
    "version": "0.1.0",
    "private": true,
    "browserslist": {
        "production": [
          ">0.2%",
          "not dead",
          "not op_mini all"
        ],
        "development": [
          "last 1 chrome version",
          "last 1 firefox version",
          "last 1 safari version"
        ]
    }
}

let bothScripts = frontPackage.scripts
bothScripts.start = "node backend/index.js && npm run build"  //TODO - fix this
bothScripts.devstart = "react-scripts start"

let bothDepends = mergeDepends(frontPackage.dependencies, backPackage.dependencies)

bothPackage.scripts         = bothScripts
bothPackage.dependencies    = bothDepends

fs.writeFileSync(outputPath, JSON.stringify(bothPackage, null, 4))

console.log(`merge-deps.js complete`)


function mergeDepends(depA, depB) {
    
    let output      = depA
    let overlapKeys = []

    for (keyB of Object.keys(depB)) {
        if (output[keyB] !== undefined) {
            if (cmpVersions(depA[keyb], depB[keyB]) > 0) {
                output[keyB] = depB[keyB]
            }
        } else {
            output[keyB] = depB[keyB]
        }
    }
    return output
}

function cmpVersions(vA, vB) {
    console.log("\nNOT IMPLEMENTED on merge-dependencies script...")
    console.log(`cannot compare versions ${vA} vs ${vB} | using: ${vB}`)
    return 1
}