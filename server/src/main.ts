import * as http from "http";
import app from "./app";

import { PORT } from "./env";

http.createServer(app.callback()).listen(PORT, () => {
  console.log(`\n\tapp is runing at http://127.0.0.1:${PORT}\n`);
});
