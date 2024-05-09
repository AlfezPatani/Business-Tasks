import mongoose from "mongoose";

const counterSchmea=new mongoose.Schema({
    _id:{type:String},
    seq:{type:Number}
});

export const Counter=mongoose.model('Counter',counterSchmea);