import express from "express";
import cors from "cors";
import progressRoutes from './routes/progress-routes.js';
import cardRoutes from './routes/card-routes.js';

import progressRoutes from "./routes/progress-routes.js";
import speakingCoachRoutes from "./routes/speakingCoachRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/progress', progressRoutes);
app.use('/api/cards', cardRoutes);

app.use("/api/progress", progressRoutes);
app.use("/api/speaking-coach", speakingCoachRoutes);

export default app;