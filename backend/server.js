import express from 'express';
import connectDb from './config/db.js';
import dotenv from 'dotenv';
import dns from 'dns';

// to resolve the recent error after node24 update, we need to set the dns servers explicitly in our code. This is because the default dns servers may not be compatible with the new node version. By setting the dns servers to known public dns servers like Cloudflare and Google, we can ensure that our application can resolve domain names correctly.
dotenv.config();

dns.setServers([
    '1.1.1.1',
    '8.8.8.8',
])

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res)=> {
    res.send("Hello World!");
});

connectDb();

app.listen(PORT, ()=> {
    console.log(`Server is runing on port http://localhost:${PORT}`);
})
