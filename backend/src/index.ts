import app from "./app";
import http from "http";
import { initSocket } from "./socket";

const server = http.createServer(app);

initSocket(server);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});