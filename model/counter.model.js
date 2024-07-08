import mongoose from "mongoose";

const counterSchmea=new mongoose.Schema({
    _id:{type:String},
    goldSeq:{type:Number},
    silverSeq:{type:Number},
    bronzeSeq:{type:Number}
});

export const Counter=mongoose.model('Counter',counterSchmea);