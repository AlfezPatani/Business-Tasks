import express from 'express'
import { Task } from '../model/task.model.js';


const taskRouter = express.Router();

taskRouter.delete('/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedClient = await Task.findByIdAndDelete(id);
        if (!deletedClient) {
            return res.status(400).json({ message: "sorry couldn't delete task " });
        }
        res.status(200).json(de);

    } catch (error) {
        res.status(400).json({ message: "sorry couldn't delete task " });
    }

})
taskRouter.patch('/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const title = req.body.title;
        const updatedTasks = await Task.findByIdAndUpdate(id, { title });
        res.status(200).json({ updatedTasks });
    } catch (error) {
        res.status(400).json({ message: "sorry ,we couldn't Update task " });
    }
})




export { taskRouter }