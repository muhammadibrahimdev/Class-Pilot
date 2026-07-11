import express from 'express';
import connectDb from './config/db.js';
import dotenv from 'dotenv';
import dns from 'dns';
import helmet from 'helmet'
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import schoolRoutes from './routes/schoolRoutes.js';
import userRoutes from './routes/userRoutes.js';
import classRoutes from './routes/classRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';

// to resolve the recent error after node24 update, we need to set the dns servers explicitly in our code. This is because the default dns servers may not be compatible with the new node version. By setting the dns servers to known public dns servers like Cloudflare and Google, we can ensure that our application can resolve domain names correctly.
dotenv.config();

dns.setServers([
    '1.1.1.1',
    '8.8.8.8',
])
await connectDb();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/users", userRoutes);
app.use("/api/classes", classRoutes);

app.get('/', (req, res)=> {
    res.send("ClassPilot API is running!");
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;  
app.listen(PORT, ()=> {
    console.log(`Server is runing on port http://localhost:${PORT}`);
})
