const qs = require('querystring')

const basicHeaders = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "max-age=0",
    "sec-ch-ua": "\"Google Chrome\";v=\"93\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"93\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "upgrade-insecure-requests": "1",
    //"cookie": "SSESS2744f84ab896362390472b0afbbe54dd=nv7rsan84fq67"
  }
const putHeaders = {
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "max-age=0",
    "content-type": "application/x-www-form-urlencoded",
    // "content-type": "application/json",
    "sec-ch-ua": "\"Google Chrome\";v=\"93\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"93\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
}

const sDecode = (s) =>  Object.keys(qs.parse(s))[0]

const putBodyFieldNameEncoded = "acf%5Bfield_5e4bac0c25353%5D"
const putBodyFieldName        = sDecode(putBodyFieldNameEncoded)

const putBodyEncoded = {
    "_acf_screen" : "acf_form",
    "_acf_post_id" : "5215",
    "_acf_validation" : "1",
    // "_acf_form" : "NktteGdiZlptKzZteDQ0NXR6NU9OYzE4cC9iZmJIbHMvYkhYbkQxTStpT1ZQVlZGMGhRdllDWno5UEpMT24zMXFHYzgrOXRBM0dudEVLMkg2Ukt0ZzNHYlNQTzBkYkcrZ1dpMXJRcXdEcTl1VlFsak9OR3I1UnlXbklWZGtiNHZabE5aTmVWNzhFUWtFajBnRDQ4T2pWTWhjU3pLNUcxR1NXOFp1dnQrYnZ6aTRKR0JwU1VTRUtQNkt4SXlEMG1zTVN6K210SnAxanJKN1JwUk5rVnBGcHN1VlgyTlJ0ckdudEhPRDlsYUdaTzhvMTF0aVdON0FXcmFEZ29tNjFmUENCY1Z3c01lTW5PalR3RnJlMUVPNzBLSkNUTElpcGNkNTJod3RZWkZNU2dDaEJqdDZhNU11dC9WdFhGbkdtQjB1bllqMXliZ2pIN2VJRnVxaFc1QlFqVUNoSGZIN0lqVXFKb0xQdFcyanZhQWVnbTFhcHM5KzZHYzYvNStlNWcyZzY2NllVZHU1Z3Vrdkt0ZERDZitqd2NoVnprVHR2MWZYOXByYUF0MGtxSHhXMHFVYXA1dWZwQXhpOXFUcGpreXpuZHNxWXBTTy9ld2pXZ3V6WWVEWWJlM2JWRE41RUdJZituTU44d2tpNjdsTnlSOWxOY1VtK0J1czdzS0E1bHJVeFhJQWVjODd5eFFrOHdWazNUcmdsMlVPeFpldllTVi9acW9kTFRiOWRCek9sVU5SZVhKdi9jbVhaMW5Hc1R6MmtQanJ5QzVXUEp5RzQxWWk1T3NBWDR3ZVdoaVdaU2c4NnVDTk5NSE82TFhDNlo2K3BVRmwrSlZFaXZPY1BhSlRZbWFobFBxQUpma1oxNWoyUVJ2SDJ1dzN3d3RPaUo3VVVkVEp1TmkyaTJBYXlWbGp2MEphQ0VRM0tXQk4reWV4TDhjZFpRNEV6eURPZVhUK2RrNlFqRGxEbThva2drRXdsOFJYMUljZS9nWXdrSVJzZURFdEl5a1YvZW0rYTBFS2dITE1TekF5dHVaUzVHelIyc2IxYzFEajcxa1pDMGt4YjJpM1VKZzEyTEFSUVcyQkV1WWlwMDk0V2kzT0MxTUc1ZGdFRis1TFFqeDhrRlVDeXdTWnBjTU1FOXRPYmp0REZiSGNTVVdKQ2k3Vmx4WHAwaHRBTlNvWVBFTHVRcWJ6YzVsaHRuNlZncUhxblN0UFpSajRGeDNZcy9FR05QaEFGdEpjV0xFU3NYallJODZzcDk4R0NVaU1KRGcwbUVvZlBjV3dBNHhhZGpDbWUwU1dVRXAwU2dMK09RRjZtcWVBRkpuZDUzaTllVFNwblZPK2pRVjAvdTYvZHVSMVE4Zjo6rKN9pC0CEAK2OwUfU9Nrsg%3D%3D",
    // "_acf_form" : "L1FXT20vZnFjSDBMbzViN3k3Y1NFRXl1VStQL01LWC9WVi9WOFFraFM2bVJLa0Z1c01ndU9CYUhZZEpHR0d2YVNiSEhpVmd2YWRsRWRmK2V3YWluN1VtVWsyd3BzYTIwenJta2haOEpVeWhPMnhPME1DUWJxZTljTmF3cCt4dUVNSGVzSFYzSHZHL2phYW1POEtocnV0ODlPVHJNK0hqRVEyUVVoUmpNV1ltazY5U0JQc1QvclpuL0s3T3cvVW45RlZickIraDZxQitQdGZ4ZmRkTk5SMGlaY2FFSE1qazM2Z1J2Qm9Xa3VKYkc3Rk9kcWVXVlhhZUtuZ0t2SUxqekpMUmh5Rm5zS1B4OGRhRDd2VUVTbVE0TXZxOE1iYW5Lcy9yOU83dStoQ3FoNmZUMkNWUVZuVEI4bmRRYnFDb0FWQVpsSkczREtvSzdtVGxLZlpoaWw3UndIWFpvampPWGtPdDFaRm1wVThyQW9lSU9qRUFleU1vNTJDRDBQLzJKZEtQVFlJYzhsME1aT0M2aDEvSXAzUXMxZEEyT3Y2ZXBsR09KYXR6NXY3TTBVN3IxTEU5V2xOOVFCYjRXOCszVWNyMUtDQXU2YW1zdk9lT2NVWmhXMFFPdFYzM0RXcmJhMHlOcmIrcERMWllGRXVLV3pDemlkdTgyZ3lmNzdFcVRTeUQvd0dSeUpZL1VkT0FRcm1rZFB4NGVSdHVRNStEaDZsQUFXNkNxaUg1bU02R2VkVHp2OEE5cVROR0w1QWJoOHFUTHA0UlkwMHNCRWZOclNLMTVYYXh0MmVHenh0cUdMV0NRTzFsZHpjZnVsL3g4MFJxaGxZM002NlJHekd2Z1dmNU9LVW1hTldPZmJUWStKVlBIcTl4WVU3K0VKUHRJamowNGVzWERKdGt4UFlwYWVMalFDQzc4Y3BFTmRxMGlPZkM1UmxONEpudVczTUZJQ0NDMktpQUZMVmhhTWxrNFVGcklhVE5OZGNlTjZzdy9qVGI4Vmp5Z0NoRTVXS2hobllGTzZhNjZtUWV4cXRxTjdmaEx6NUt2UUJ2N3BMVVZxU2IxR1N4TTZCWllDTlhjOVpoOVpGTVZ5TW1kYzN6Y2tmVC90VGdONkgwUjR4cVUwWS9HOVhQNHY3aXZYdVpsRjV6M0h1am01VXJHeHVDS3oxaGpHU1RBbjlHSjc1MFg5MC82T1BLVEFaajlHK1RHNEtmQUI3SFlGYnFBb2VxQUxvL2ljcHJ0ZGp1RFdEQ1pZYVAyempMTVlXc1piOXBZMStRREtxaGFoOXFDdEdRK0NSemNoN1duNjhQOTNSckgyV2hPSlBjZ005N2RFa1p0OWRVbEtHcHNFKyt4cWpwNTo6ZUllBDQGRG9eqAOwCrPMaQ%3D%3D",
    "_acf_form" : "bVNCaFFtN01uR0F0VzJ2K0dqZDV3d01LYUljM25PQzRjWjYvWVEyREt0N0NJdXJNbnlOUTB2a1FsQUV6d3BkTVBadko0M2RSZTJudGJ4RVQzUGhxa3NlOFNVeE5xN2JPaEJXbkw0cnd4TVNUeUc2UU9TTHF6WWkwako4THkrVG9CdUVmUTlXS0hoYXgrY3JQU1dmOHpyWXVyQ0ltWHA2RzBuWmFVMHYzL0lCZVh6TXR1bjF3NFBaa3BKZWZmcHQrKys4QUkyUlVPd2tNeFJ2YkNRZVlnbi9oMkExa1dpU2JWdUkrd3FPazhhdEFsWEo5aGRhQzRucUpMakdaa2t0Z0JGM0M1ekYydk92VWVrLy80UXUycE0wOUhHc0NUdmN4YUt0Zkw0ZndYT1d2WFoxR3hZR3JYTXJET29YODZ2RkU0NGJDU0ZEVWNVeXRTOWlzQjF6L0RqZHVidnE0M1dCdGxiazJuTEZVais5Wi9sOWRNUndwdFBuWSt3MnI0ak1aSGJWV0ZhTmtvRmQ1ZHhIZG1yN0hHcE9nWUZHdXJMU1YyZmFwbytuWTBDZWJkR2lPVFpIVkFmRUxpSjVXWThrdDdNeGVIeG1CUlpESnNDbGo1UE50YkpqeXZ1c05RbUNrd1cxTFlYbXIrL04wbFJVNEZqeUtXYU9oL0JBbW1XSzRkTUx2WkF4RVVQemtQQVVURy9BeUZjUEZaQ1RFZVRaYU5xV1JYSUZ6UFprcnNxdG9aUElqRWhqRi9jeXRsOHByODM3RjEwS2ZHeWYrQkcvT0U0eWpoTUY5eWtiMVM2V1BKM1pPVXlrcjdVVEtSSWNFS3N0dUdZTnpKYUx3dkhSdGNmdFZnWDF1NW5VUkpJQlEybUxVc0VqQUNkOGlPSWRhRmo3TktqLy9CM1BmdzBmSDFOYktjTTlSLytCVVN4cmFub1R1YjkvWDdPUE5IUVREajFteDdZNFY5d0hkbDYzRGQ0aXpoQjRGTktWNWtzMFdpeEtjVEhPeFhXdVVXeGZvUHNJRER0SmN4SEZ1eU1QbkdraTRBT2V2ei9JeW5PQmlzY24xSjQzNkg3MGJ5TDZpM0tSVkI0UEl2TFQ5YWl3RUQ5OWlIejhQOXJnMzlpbnp6cVR4WXdnbGRBSDZiMWc0TDdMNVRPdWN0TFJuUGg0U3JYS0Qwak54eGJtdXM2dkJ2TEFQTGNveHRkYVd6aG90UnV4RSt6ZGdlR1VWR1VyWUlXeWpxWm9UdUZWenBqeThmb29qaktNOXg2dDYzekVLYVdYL3p2RlBQYnFPbjJraVQxQVl3U3JMQ2Z3SVFhQXI0REx4QzJHaC9XNjUwM2ovOVNNSUNNZlJVRm13T3NCOTo6YmaB9hSgioR2C2EqwAFWyA==",
    // "_acf_nonce" : "02f5285704",
    // "_acf_nonce" : "0cbcde25b0",
    "_acf_nonce" : "16b4c67b08",
    "_acf_changed" : "1",
    "acf%5Bfield_5e4bac0c25353%5D" : null,
    "acf%5B_validate_email%5D" : "",
    "playlists_search" : "Search",
    "playlists_search_submitted" : "yes",
    "filter_search_type" : "playlists"
}

let putBody = {}
for (const k of Object.keys(putBodyEncoded)) {
  putBody[sDecode(k)] = sDecode(putBodyEncoded[k])
}


module.exports = {basicHeaders, putHeaders, putBody, putBodyFieldName}