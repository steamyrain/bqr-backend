const development = {
    database: 'bqr',
    username: 'rain',
    password: 'root',
    host: 'localhost',
    dialect: 'mysql',
};

const testing = {
    database: 'bqr',
    username: 'rain',
    password: 'root',
    host: 'localhost',
    dialect: 'mysql',
};

const production = {
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: 'mysql',
};

export {development,testing,production};
