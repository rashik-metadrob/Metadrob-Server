import http from 'http'
import serverConfig from './server'
import connectDB from '../Configs/dbConnection'
import {routes} from './Adaptors/Routes'
import config from '../Configs/serverConfig'
import expresscofig from './express'
import dependencies from './Frameworks/Dependencies/dependencies'
import * as dotenv from 'dotenv';
import logger from './Frameworks/Common/EnvInterface/logger'
import express from "express";


  

const app=express()
const server=http.createServer(app)
dotenv.config()
console.log(process.env.NODE_ENV,'node env')
//connecting mongodb database
connectDB(config)
//configure all express settings
expresscofig(app)

//all routes
app.use('/v1',routes(dependencies))



const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('Server closed');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };
  
  const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
  };
  
  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);
  
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });




//starting the server
serverConfig(server,config).startServer()
  