import mongoose from "mongoose";

const clientSchema=new mongoose.Schema({
    tier:{
        type:String,
        required:[true,"clientId  is required"]
    },
    clientId:{
        type:Number,
        unique:true,
        required:[true,"clientId  is required"]},
    name:{
        type:String,
        required:[true,"client name is required"]
    },
    address:{
        type:String,
        required:[true,"clientId  is required"]
    },
    phone:{
        type:Number,
        required:[true,"client phone no is required"]
    },
    tasks:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Task'
    }]
},{timestamps:true});

clientSchema.index({name:'text'});


export const Client=mongoose.model('Client',clientSchema);