const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const noteSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    title:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    }},
    {
        timestamps:true
    }
)

noteSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',      // The field to auto-increment
    id: 'ticketNums',         // The identifier for the counter collection
    start_seq: 500            // The starting value of the sequence
  });
module.exports = mongoose.model('note', noteSchema);