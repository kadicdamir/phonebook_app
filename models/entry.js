var mongoose = require("mongoose");

/*Entry.create(
    {
       name: "Mujo mujic",
       number: "061085085",
       email: "mmujic@hotmail.com"
    }, function(err, entry){
        if(err){
            console.log(err);
        } else {
            console.log("NEWLY CREATED ENTRY");
            console.log(entry);
        }
    });*/


var entrySchema = new mongoose.Schema({
    name: String,
    number: String,
    email: String
});


module.exports = mongoose.model("Entry", entrySchema);