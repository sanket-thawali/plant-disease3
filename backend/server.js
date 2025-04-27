import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors'; 
import diseasesRoutes from './routes/diseases.js';
import userRoutes from './routes/user.js';
import mongoose from 'mongoose';
import { spawn } from 'child_process';
import axios from 'axios';
import multer from 'multer';
import FormData from 'form-data';
import path from 'path';

const app = express();

// Use CORS middleware
app.use(cors());
const __dirname = path.resolve();
app.use(express.json());

app.use((req, res, next) => {
  next();
});

// Spawn the python prediction server
const pythonProcess = spawn("python", ["../api/predict_server.py"]);

pythonProcess.stdout.on("data", (data) => {
  // console.log(`Python stdout: ${data}`);
});

pythonProcess.stderr.on("data", (data) => {
  console.error(`Python stderr: ${data}`);
});

pythonProcess.on("close", (code) => {
  // console.log(`Python process exited with code ${code}`);
});

// Setup multer for file upload handling
const upload = multer();

// Proxy /predict requests to python server with file forwarding
app.post("/predict", upload.single("file"), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);

    const response = await axios.post(
      "http://localhost:10000/predict",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: req.headers.authorization || "",
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error proxying to python server:", error.message);
    res.status(500).json({ error: "Prediction service error" });
  }
});

app.use("/api/diseases", diseasesRoutes);
app.use("/api/user", userRoutes);
import translationRoutes from "./routes/translation.js";
app.use("/api/translation", translationRoutes);
app.use(express.static(path.join(__dirname, "/frontend/build")));
app.get("*",(_,res)=>{
    res.sendFile(path.resolve(__dirname,"frontend","build","index.html"))
});

// connect to db
mongoose.set("strictQuery", false); // this is added to remove deprecation warning
mongoose
  .connect(process.env.MONGO_URL)
  .then((result) => {
    // Listen for requests:
    app.listen(process.env.PORT, () => {
      console.log("Connected to db and Listening on port", process.env.PORT);
    });
  })
  .catch((err) => {
    // console.log(err);
  });
