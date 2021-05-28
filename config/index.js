import privateRoutes from './routes/privateRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
const config = {
    migrate: false,
    publicRoutes,
    privateRoutes,
    port: process.env.PORT || '3030',
};
export default config;
