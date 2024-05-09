import express from 'express'
import { Task } from '../model/task.model.js';


const taskRouter = express.Router();

taskRouter.delete('/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedClient=await Task.findByIdAndDelete(id);
        if(!deletedClient){
            return res.status(400).json({ message: "sorry couldn't delete task " });
        }
        res.status(200).json(de);
        
    } catch (error) {
        res.status(400).json({ message: "sorry couldn't delete task " });
    }

})


export { taskRouter }