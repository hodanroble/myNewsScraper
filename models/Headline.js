const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const HeadlineSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectID,
        ref: "Note"
    }
});

const Headline = mongoose.model("Article", HeadlineSchema);

module.exports = Headline;