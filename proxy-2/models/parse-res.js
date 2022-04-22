const mongoose = require('../db/connection')

const ParseResSchema = new mongoose.Schema(
    {
        playlistDate: {
            type: Date,
            required: true,
        },
        searchDate: {
            type: Date,
            required: true,
        },
        complete: {
            type: Boolean,
            required: false,
        },
        isMock: {
            type: Boolean,
            default: true,
        },
        items: [
            {
                time: {
                    type: Date,
                    required: true,
                },
                timeStr: {
                    type: String,
                    required: false,
                },
                title: {
                    type: String,
                    required: true,
                },
                artist: {
                    type: String,
                    required: true,
                },
                album: {
                    type: String,
                    required: false,
                },
            }
        ],

        // This would be interesting, allow us to modify the item
        // schema as we go, but it's too complicated for now.
        // parseItems: [{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'ParseItem',
        //     required: false,
        // }]

    }
)

const ParseRes = mongoose.model('ParseRes', ParseResSchema)

module.exports = ParseRes