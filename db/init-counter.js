import { Counter } from "../model/counter.model.js";


    export const intializeCounter= async() => {
        try {
            const val = await Counter.findOne({ _id: 'akkipaji' });
            if (!val) {
                await Counter.create({_id:'akkipaji',seq:111222});
                console.log('counter intialize...........');
            }
            
        } catch (error) {
            console.log('error occure during intializing the counter:',error);
        }
    }
