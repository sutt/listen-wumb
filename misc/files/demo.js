
inp = "99-22-21"

function pad(n, amt=2) {
    return (n.toString().length === amt) ? n: `0${n}`
}

elems = inp.split("-")
if (elems.length !== 3) {
    return 'date not properly formatted in three parts'
}
const attemptCast = new Date(`20${elems[2]}-${pad(elems[0])}-${pad(elems[1])}`)
if (attemptCast.toString() === 'Invalid Date') {
    return `bad date - not able to cast`
}

dParam = `${elems[2]}-${pad(elems[0])}-${pad(elems[1])}`




// t0 = "6:03 pm"
// t1 = "7:22 pm"

// var baseDate = "2000 january 1"
// d0 = new Date(`${baseDate} ${t0}`)
// d1 = new Date(`${baseDate} ${t1}`)


// deltaMs = d1 - d0
// deltaMins = deltaMs / (1e3 * 60)

// console.log(`Mins bewteen ${t0} to ${t1}: ${deltaMins}`)
