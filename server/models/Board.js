const mongoose = require('mongoose');




const UmlSchema = new mongoose.Schema({
   id:String,
   name:String,
   functions:[String],
   fields:[String]
});

const BoardSchema = new mongoose.Schema({
   title:{
      type: String,
      default: "test",
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