const mongoose = require('mongoose');




const UmlSchema = new mongoose.Schema({
   name:String,
   functions:[String],
   fields:[String],
   x: Number,
   y: Number

});

const BoardSchema = new mongoose.Schema({
   title:{
      type: String,
      default: "New Board",
   },
   umls:{
        type:[UmlSchema],
        default:[]
   },
   owner:{
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Account'
   }



});


const BoardModel = mongoose.model("Board",BoardSchema);

module.exports = BoardModel;