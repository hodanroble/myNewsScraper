//requrie mongooose for creation use of this note feature of users to
const mongoose = require("mongoose");

//save the reference constructor for the Schema.
const Schema = mongoose.Schema;

//Schema constructor to create the Note Schema object
//Much like sequelize modling 
const NoteSchema = new Schema({
    //This will be the string part of the title
    title: String,
    //this will be the body part of the note.
    body: String
});

const Note = mongoose.model("Note", NoteSchema);

//export the Note model out to be used.
module.exports = Note;