import "./config/pre-start";
import "./config/env";
import Server from "./config/server";

const server = new Server();

server.start();
