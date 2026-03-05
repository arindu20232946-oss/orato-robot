import express from "express";
import cors from "cors";
import progressRoutes from './routes/progress-routes.js'; // ✅ Changed to import

const app = express();
const cardroutes = require('./routes/card-routes');

app.use(cors());
app.use(express.json());
app.use('/api/progress', progressRoutes);
app.use('/api/cards', cardroutes);

export default app;
