import { createServer, Server as HttpServer } from "http";
import app from "./app";
import connectDb from "./connect-db";
import Env from "@env";

class Server {
  server: HttpServer;
  constructor() {
    this.server = createServer(app);
  }

  start() {
    connectDb();
    this.server.listen(Env.PORT, () => {
      console.log(
        `Server is up and running in ${Env.NODE_ENV} environment on PORT: ${Env.PORT}`
      );
    });
  }
}

export default Server;
