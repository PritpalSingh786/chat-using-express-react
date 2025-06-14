// socket.js
import { io } from "socket.io-client";
const socket = io("http://192.168.0.115:5000", {
  transports: ["websocket"],
});
export default socket;
