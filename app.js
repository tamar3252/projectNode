const express=require('express');
const http=require('http');
const cors=require('cors');

require('./db/mongoConnect')
const {initRoutes} =require('./routes/configRoutes')

const app=express();

app.use(cors());
app.use(express.json())

initRoutes(app)

const server=http.createServer(app);
let port = process.env.PORT|| 3001
server.listen(port);



