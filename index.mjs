import express from 'express';
import './config/dotenv.mjs'
import { userRouter } from './routes/users.router.mjs';
const server = express();

server.use(express.json());

server.use(userRouter)

server.listen(process.env.PORT || 3000, () => console.log(`http://localhost:${process.env.PORT || 3000}`));