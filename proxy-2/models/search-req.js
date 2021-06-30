const mongoose = require('../db/connection')

const SearchReqSchema = new mongoose.Schema(
    {
        songTitle: {
            type: String,
            required: true
        },
        songArtist: {
            type: String,
            required: true
        },
        songAlbum: {
            type: String,
            required: false,
        },
        normalizedTitle: {          // normalizedXxxxxx: these are lower cased + trimmed and special-char stripped
            type: String,           // this facilitates quicker lookup .find method
            required: false,
        },
        normalizedArtist: {
            type: String,
            required: false,
        },
        normalizedAlbum: {
            type: String,
            required: false,
        },
        scrapeTime: {
            type: String,
            required: false
        },
        scrapeDate: {
            type: String,
            required: false,
        },
        scrapeDateTime: {
            type: mongoose.Schema.Types.Date,
            required: false,
        },
        requestDateTime: {
            type: mongoose.Schema.Types.Date,
            required: true,
        },
        requestResponseValid: {
            type: Boolean,
            required: true
        },
        requestResponseErrMessage: {
            type: String,
            required: false,
        },
        requestResponse: {
            type: mongoose.Schema.Types.ObjectId,
            ref:  'SearchRes',
            required: false  
        }
    },
    {timestamps: true}
)
const SearchReq = mongoose.model('SearchReq', SearchReqSchema)

module.exports = SearchReq
