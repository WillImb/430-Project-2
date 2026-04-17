const mongoose = require('mongoose');

let BoardModel = {};

const BoardSchema = new mongoose.Schema({
   umls:{
        type:[String],
        default:["yo"]
   }



});


BoardModel = mongoose.model("Board",BoardSchema);

module.exports = BoardModel;