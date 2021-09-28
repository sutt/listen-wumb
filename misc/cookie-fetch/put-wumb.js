const fetch = require("node-fetch")

const searchDate = "20210902"
// const searchDate = "20210923"

const cookies = {
    // 'SSESS2744f84ab896362390472b0afbbe54dd': 'hcjcp3v77ju8s70rkfog1t4c03',
    'SSESS2744f84ab896362390472b0afbbe54dd':'pueg8n37d0tsqp7efbvms86i3m',
    '1P_JAR': '2021-09-23-12',
}

const bodyString = "_acf_screen=acf_form&_acf_post_id=5215&_acf_validation=1&_acf_form=NktteGdiZlptKzZteDQ0NXR6NU9OYzE4cC9iZmJIbHMvYkhYbkQxTStpT1ZQVlZGMGhRdllDWno5UEpMT24zMXFHYzgrOXRBM0dudEVLMkg2Ukt0ZzNHYlNQTzBkYkcrZ1dpMXJRcXdEcTl1VlFsak9OR3I1UnlXbklWZGtiNHZabE5aTmVWNzhFUWtFajBnRDQ4T2pWTWhjU3pLNUcxR1NXOFp1dnQrYnZ6aTRKR0JwU1VTRUtQNkt4SXlEMG1zTVN6K210SnAxanJKN1JwUk5rVnBGcHN1VlgyTlJ0ckdudEhPRDlsYUdaTzhvMTF0aVdON0FXcmFEZ29tNjFmUENCY1Z3c01lTW5PalR3RnJlMUVPNzBLSkNUTElpcGNkNTJod3RZWkZNU2dDaEJqdDZhNU11dC9WdFhGbkdtQjB1bllqMXliZ2pIN2VJRnVxaFc1QlFqVUNoSGZIN0lqVXFKb0xQdFcyanZhQWVnbTFhcHM5KzZHYzYvNStlNWcyZzY2NllVZHU1Z3Vrdkt0ZERDZitqd2NoVnprVHR2MWZYOXByYUF0MGtxSHhXMHFVYXA1dWZwQXhpOXFUcGpreXpuZHNxWXBTTy9ld2pXZ3V6WWVEWWJlM2JWRE41RUdJZituTU44d2tpNjdsTnlSOWxOY1VtK0J1czdzS0E1bHJVeFhJQWVjODd5eFFrOHdWazNUcmdsMlVPeFpldllTVi9acW9kTFRiOWRCek9sVU5SZVhKdi9jbVhaMW5Hc1R6MmtQanJ5QzVXUEp5RzQxWWk1T3NBWDR3ZVdoaVdaU2c4NnVDTk5NSE82TFhDNlo2K3BVRmwrSlZFaXZPY1BhSlRZbWFobFBxQUpma1oxNWoyUVJ2SDJ1dzN3d3RPaUo3VVVkVEp1TmkyaTJBYXlWbGp2MEphQ0VRM0tXQk4reWV4TDhjZFpRNEV6eURPZVhUK2RrNlFqRGxEbThva2drRXdsOFJYMUljZS9nWXdrSVJzZURFdEl5a1YvZW0rYTBFS2dITE1TekF5dHVaUzVHelIyc2IxYzFEajcxa1pDMGt4YjJpM1VKZzEyTEFSUVcyQkV1WWlwMDk0V2kzT0MxTUc1ZGdFRis1TFFqeDhrRlVDeXdTWnBjTU1FOXRPYmp0REZiSGNTVVdKQ2k3Vmx4WHAwaHRBTlNvWVBFTHVRcWJ6YzVsaHRuNlZncUhxblN0UFpSajRGeDNZcy9FR05QaEFGdEpjV0xFU3NYallJODZzcDk4R0NVaU1KRGcwbUVvZlBjV3dBNHhhZGpDbWUwU1dVRXAwU2dMK09RRjZtcWVBRkpuZDUzaTllVFNwblZPK2pRVjAvdTYvZHVSMVE4Zjo6rKN9pC0CEAK2OwUfU9Nrsg%3D%3D&_acf_nonce=02f5285704&_acf_changed=1&acf%5Bfield_5e4bac0c25353%5D=20210924&acf%5B_validate_email%5D=&playlists_search=Search&playlists_search_submitted=yes&filter_search_type=playlists"
// use bp.py script to parse this json

const body = {
    "_acf_screen" : "acf_form",
    "_acf_post_id" : "5215",
    "_acf_validation" : "1",
    "_acf_form" : "NktteGdiZlptKzZteDQ0NXR6NU9OYzE4cC9iZmJIbHMvYkhYbkQxTStpT1ZQVlZGMGhRdllDWno5UEpMT24zMXFHYzgrOXRBM0dudEVLMkg2Ukt0ZzNHYlNQTzBkYkcrZ1dpMXJRcXdEcTl1VlFsak9OR3I1UnlXbklWZGtiNHZabE5aTmVWNzhFUWtFajBnRDQ4T2pWTWhjU3pLNUcxR1NXOFp1dnQrYnZ6aTRKR0JwU1VTRUtQNkt4SXlEMG1zTVN6K210SnAxanJKN1JwUk5rVnBGcHN1VlgyTlJ0ckdudEhPRDlsYUdaTzhvMTF0aVdON0FXcmFEZ29tNjFmUENCY1Z3c01lTW5PalR3RnJlMUVPNzBLSkNUTElpcGNkNTJod3RZWkZNU2dDaEJqdDZhNU11dC9WdFhGbkdtQjB1bllqMXliZ2pIN2VJRnVxaFc1QlFqVUNoSGZIN0lqVXFKb0xQdFcyanZhQWVnbTFhcHM5KzZHYzYvNStlNWcyZzY2NllVZHU1Z3Vrdkt0ZERDZitqd2NoVnprVHR2MWZYOXByYUF0MGtxSHhXMHFVYXA1dWZwQXhpOXFUcGpreXpuZHNxWXBTTy9ld2pXZ3V6WWVEWWJlM2JWRE41RUdJZituTU44d2tpNjdsTnlSOWxOY1VtK0J1czdzS0E1bHJVeFhJQWVjODd5eFFrOHdWazNUcmdsMlVPeFpldllTVi9acW9kTFRiOWRCek9sVU5SZVhKdi9jbVhaMW5Hc1R6MmtQanJ5QzVXUEp5RzQxWWk1T3NBWDR3ZVdoaVdaU2c4NnVDTk5NSE82TFhDNlo2K3BVRmwrSlZFaXZPY1BhSlRZbWFobFBxQUpma1oxNWoyUVJ2SDJ1dzN3d3RPaUo3VVVkVEp1TmkyaTJBYXlWbGp2MEphQ0VRM0tXQk4reWV4TDhjZFpRNEV6eURPZVhUK2RrNlFqRGxEbThva2drRXdsOFJYMUljZS9nWXdrSVJzZURFdEl5a1YvZW0rYTBFS2dITE1TekF5dHVaUzVHelIyc2IxYzFEajcxa1pDMGt4YjJpM1VKZzEyTEFSUVcyQkV1WWlwMDk0V2kzT0MxTUc1ZGdFRis1TFFqeDhrRlVDeXdTWnBjTU1FOXRPYmp0REZiSGNTVVdKQ2k3Vmx4WHAwaHRBTlNvWVBFTHVRcWJ6YzVsaHRuNlZncUhxblN0UFpSajRGeDNZcy9FR05QaEFGdEpjV0xFU3NYallJODZzcDk4R0NVaU1KRGcwbUVvZlBjV3dBNHhhZGpDbWUwU1dVRXAwU2dMK09RRjZtcWVBRkpuZDUzaTllVFNwblZPK2pRVjAvdTYvZHVSMVE4Zjo6rKN9pC0CEAK2OwUfU9Nrsg%3D%3D",
    "_acf_nonce" : "02f5285704",
    "_acf_changed" : "1",
    "acf%5Bfield_5e4bac0c25353%5D" : searchDate,
    "acf%5B_validate_email%5D" : "",
    "playlists_search" : "Search",
    "playlists_search_submitted" : "yes",
    "filter_search_type" : "playlists"
}

const headers =  {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "max-age=0",
    "content-type": "application/x-www-form-urlencoded",
    "sec-ch-ua": "\"Google Chrome\";v=\"93\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"93\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1"
  }

const compositeHeaders = headers
  
for (var kv of Object.entries(cookies)) {
      compositeHeaders[kv[0]] = kv[1]
  }

console.log(compositeHeaders)



fetch("https://wumb.org/playlist-archives/", {
    "headers": compositeHeaders,
    "referrer": "https://wumb.org/playlist-archives/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": JSON.stringify(bodyString),
    "method": "POST",
    "mode": "cors",
    // "credentials": "include"
    })
.then(res => {
    
    console.log(`response ok? ${res.ok ? 'yes': 'no'}\n`)
    
    for (var pair of res.headers.entries()) {
        console.log(pair)
    }
    })