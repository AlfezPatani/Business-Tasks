
import express from 'express';
import clientRouter from './routes/client.route.js';
import { taskRouter } from './routes/task.route.js';
import './db/connection.db.js';
const app=express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api',clientRouter);
app.use('/api',taskRouter);
app.listen(process.env.PORT || 8080,()=>console.log('server started......'))