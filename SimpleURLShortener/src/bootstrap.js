import { globalError } from "./utils/errorHandler.js";
import { connection } from "../DB/connection.js";
import urlRouter from './modules/url/url.routes.js';
import bodyParser from 'body-parser';

export function bootstrap(app, express) {
  connection();
  app.use(express.json());
  app.use('/uploads', express.static('uploads'));
  app.use('/url', urlRouter);
  app.use(bodyParser.json());
  app.use('*', (req, res, next) => {
    return res.status(404).json({ message: "Invalid Request" });
  });
  app.use(globalError);
}


