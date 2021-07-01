const mongoose = require('../db/connection')

const SearchResSchema = new mongoose.Schema(
    {
        response: {
            type: Object,
            required: true,
        },
    }
)

const SearchRes = mongoose.model('SearchRes', SearchResSchema)

module.exports = SearchRes