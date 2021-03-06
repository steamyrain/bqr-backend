import bodyParser from 'body-parser'
import express from 'express'
import helmet from 'helmet'
import http from 'http'
import cors from 'cors'
import cookieParser from 'cookie-parser'

/**
 * server configuration
 */
import config from '../config/index.js'
import dbService from './services/db.service.js'
import auth from './policies/auth.policy.js'

// environment: development, staging, testing, production
const environment = process.env.NODE_ENV;

/**
 * express application
 */
const app = express();
const server = http.Server(app);
const DB = dbService(environment, config.migrate).start();

// allow cross origin requests
// configure to only allow requests from certain origins
const corsOptions = { /* both of these header enables cors set cookie */
    origin: 'http://localhost:8080', 
    credentials: true
}

app.use(cors(corsOptions));

// secure express app
app.use(helmet({
  dnsPrefetchControl: false,
  frameguard: false,
  ieNoOpen: false,
}));

// parsing the request bodys
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// cookie parser
switch (environment) {
    case 'development':
        app.use(cookieParser('secret'))
        break;
    default:
        app.use(cookieParser(process.env.NODE_SEC))
        break;
}

// secure your private routes with jwt authentication middleware
app.all('/private/*', (req, res, next) => auth(req, res, next));

// fill routes for express application
app.use('/public', config.publicRoutes);
app.use('/private', config.privateRoutes);

server.listen(config.port, () => {
  if (environment !== 'production' &&
    environment !== 'development' &&
    environment !== 'testing'
  ) {
    console.error(`NODE_ENV is set to ${environment}, but only production and development are valid.`);
    process.exit(1);
  }
  return DB;
});
