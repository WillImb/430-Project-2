const mongoose = require('mongoose');


let BoardModel = {};

const BoardSchema = new mongoose.Schema({
   

});


BoardModel = mongoose.model("Board",BoardSchema);

module.exports = BoardModel;