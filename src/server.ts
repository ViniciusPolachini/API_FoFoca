import { serverHttp, app } from "./http";
import './websocket';

serverHttp.listen(3000, () => {
    console.log("Server is running");
})

