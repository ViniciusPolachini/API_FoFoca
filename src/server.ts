import { serverHttp, app } from "./http";
import {getUsers} from './websocket';
import './websocket';

app.get("/users", (req, res) => {
    res.send(getUsers);
})

serverHttp.listen(3000, () => {
    console.log("Server is running");
})

