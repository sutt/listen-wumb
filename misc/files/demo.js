
t0 = "6:03 pm"
t1 = "7:22 pm"

var baseDate = "2000 january 1"
d0 = new Date(`${baseDate} ${t0}`)
d1 = new Date(`${baseDate} ${t1}`)


deltaMs = d1 - d0
deltaMins = deltaMs / (1e3 * 60)

console.log(`Mins bewteen ${t0} to ${t1}: ${deltaMins}`)
