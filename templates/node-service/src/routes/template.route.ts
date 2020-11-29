import {Router, Request, Response} from "express";

const <%= entityName %>Router = Router();

<%= entityName %>Router.get('/', (req: Request, res: Response) => res.status(200).send('Hello World') );

export default <%= entityName %>Router
