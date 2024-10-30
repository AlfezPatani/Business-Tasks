import { json, Router } from 'express';
import { Client } from '../model/client.model.js';
import { Task } from '../model/task.model.js'
import { Counter } from '../model/counter.model.js';
import { convertToDDMMYYYY } from '../utility.js';


const clientRouter = Router();

const initClientId = async (req, res, next) => {
    try {
        const id = await Counter.findById('akkipaji');

        if (!id) {
            //yoyo
            console.log('inside if');
            const counter = new Counter();
            counter._id = 'akkipaji';
            counter.goldSeq = 110000;
            counter.silverSeq = 330000;
            counter.bronzeSeq = 660000;
            await counter.save();
        }
        next();
    } catch (error) {
        return res.status(400).json({ message: " problem occure in server during initializing a customer key" });
    }
}

const createClientId = async (req, res, next) => {
    try {
        const tier = req.body.tier;
        if (!tier) {
            return res.status(400).json({ message: "Tier is required" });
        }

        let update;
        if (tier === 'gold') {
            update = { $inc: { goldSeq: 1 } };
        } else if (tier === 'silver') {
            update = { $inc: { silverSeq: 1 } };
        } else if (tier === 'bronze') {
            update = { $inc: { bronzeSeq: 1 } };
        } else {
            return res.status(400).json({ message: "Invalid tier value" });
        }

        const id = await Counter.findByIdAndUpdate(
            'akkipaji',
            update,
            { new: true }
        );

        req.body.clientId = id[tier + 'Seq'];
        next();

    } catch (error) {
        console.log("Error updating client ID:", error);
        res.status(400).json({ message: "Couldn't generate key" });
    }
}



clientRouter.get('/counter', async (req, res) => {
    await Counter.deleteMany()
    const counter = await Counter.find();
    res.json(counter);
});

clientRouter.post('/clients', initClientId, createClientId, async (req, res) => {
    if (req.body) {
        console.log();
        const { clientId, name, address, tier, phone } = req.body;
        let { title, startDate, endDate } = req?.body.task;
        startDate = convertToDDMMYYYY(startDate);
        endDate = convertToDDMMYYYY(endDate);
        try {
            const client = new Client({
                clientId,
                name,
                address,
                tier,
                phone,
                tasks: []
            });
            const task = await Task.create({ title, startDate, endDate });
            client.tasks.push(task._id);
            await client.save();
            res.status(200).json(client);

        } catch (error) {
            if (error?.errors) {
                return res.status(400).json(error)
            }
            res.status(500).json({ message: 'internal server error', path: 'server' });
        }
    }
    else {
        res.status(400).json({ message: "please enter valid information" });
    }
})

clientRouter.get('/clients/:clientId', async (req, res) => {

    try {

        const client = await Client.findOne({ clientId: req.params.clientId }).populate('tasks');
        if (!client) {
            return res.status(404).json({ message: "client doesn't exists" });
        }

        res.status(200).json(client);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error', path: 'server', error: error });
    }
})

clientRouter.get('/clients', async (req, res) => {
    try {
        const client = await Client.find({}).populate('tasks');
        if (!client) {
            return res.status(404).json({ message: "client doesn't exists" });
        }
        res.status(200).json(client);

    } catch (error) {
        res.status(500).json({ message: 'internal server error', path: 'server', error: error });
    }
})

clientRouter.delete('/clients/:clientId', async (req, res) => {
    try {
        const cId = Number(req.params.clientId);
        const client = await Client.findOneAndDelete({ clientId: { $eq: cId } });
        if (!client) {
            return res.status(404).json({ message: "client couldn't find" });
        }
        res.status(200).json({ message: "client deleted successfully", client });
    } catch (error) {
        res.status(500).json({ message: 'internal server error', path: 'server', error: error });
    }
});

clientRouter.patch('/clients/:clientId', async (req, res, next) => {
    const id = Number(req.params.clientId);
    let { task, title, startDate, endDate } = req.body;

    startDate = convertToDDMMYYYY(startDate);
    endDate = convertToDDMMYYYY(endDate);


    if (task) {

        try {

            const newTask = await Task.create({ title, startDate, endDate });
            const { tasks } = await Client.findOne({ clientId: { $eq: id } }, { tasks: 1 });
            if (!tasks) {
                res.status(400).json({ message: `sorry couldn't add task to ${id} because client doesn't exist` });
            }
            else {
                tasks.push(newTask._id);
                const updatedClient = await Client.findOneAndUpdate({ clientId: { $eq: id } }, { tasks })
                return res.status(200).json(newTask);
            }

        } catch (error) {
            console.log(error);
            res.status(400).json({ message: `sorry couldn't add task to ${id}` });
        }

    }
    next();
},
    async (req, res) => {
        try {
            const id = Number(req.params.clientId);
            const data = req.body;
            if (data.name || data.address) {
                const updatedClient = await Client.findOneAndUpdate({ clientId: id }, { $set: data }, { new: true });
                if (!updatedClient) {
                    return res.status(400).json({ message: `sorry,couldn't update client name` });
                }
                res.status(200).json(updatedClient)
            }
            else {
                res.json({ message: 'not served this request' });
            }


        } catch (error) {
            res.status(400).json({ message: `can't update the client` });
        }
    })

//searching the client

clientRouter.post('/clients/:searchQuery', async (req, res) => {
    const searchQuery = req.params.searchQuery;
    try {
        const result = await Client.find({ $text: { $search: searchQuery } });
        if (!result || result.length <= 0) {
            return res.status(404).json({ message: "client couldn't find" });
        }
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ message: 'internal server error', path: 'server', error: error });
    }
})





export default clientRouter
