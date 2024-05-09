import dotenv from 'dotenv'
dotenv.config()
import mongoose from "mongoose";
import { intializeCounter } from "./init-counter.js";

(
    async () => {
        try {
            await mongoose.connect(process.env.CONNECTION_STRING);
            console.log('connected to database');
            await intializeCounter()
        } catch (error) {
            console.log(`error occure while connecting to database ------\n more info:${error}`);
            process.exit(1);
        }
    }
)();