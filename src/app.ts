import express from 'express';
import { auth } from './lib/auth';
import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import { postRouter } from './modules/post/post.router';
import { commentRouter } from './modules/comment/comment.router';

const app = express();
app.use(express.json());
app.use(cors(
    {
        origin: process.env.APP_URL || "http://localhost:4000",
        credentials: true,
    }
))

app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use("/posts", postRouter);
app.use("/comments", commentRouter);


app.get('/', (req, res) => {
    res.send('Prisma blog list server is running!');
});

export default app;