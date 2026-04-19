const mongoose = require('mongoose');

let BoardModel = {};

const BoardSchema = new mongoose.Schema({
   title:{
      type: String,
      default: "test",
   },
   umls:{
        type:[String],
        default:["yo"]
   },
   owner:{
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Account'
   }



});


BoardModel = mongoose.model("Board",BoardSchema);

module.exports = BoardModel;