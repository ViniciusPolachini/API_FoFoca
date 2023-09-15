import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

export const app = express();

app.use(cors());

export const serverHttp = http.createServer(app);

export const io = new Server(serverHttp, {
    cors: {
        origin:"*"
    }
});
