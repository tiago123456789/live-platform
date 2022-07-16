import { io } from "socket.io-client"

let socket = null


export default () => {
    if (!socket) {
        socket = io("http://localhost:3001")
    }

    return socket;
}