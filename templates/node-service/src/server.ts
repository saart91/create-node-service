require('dotenv').config();
import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import <%= entityName %>Router from './routes/<%= entityName %>.route'

const app = express();

app.use(bodyParser.json());
app.use('/<%= entityName %>', <%= entityName %>Router)

app.get('/', (req: Request, res: Response) =>
  res.status(200).send('Hello World')
);

app
  .listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
  })
  .on('error', (err) => {
    console.log(err);
  });
