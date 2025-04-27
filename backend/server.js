require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import CORS
const diseasesRoutes = require('./routes/diseases');
const userRoutes = require('./routes/user');
const mongoose = require('mongoose');
const { spawn } = require('child_process');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');

const app = express();

// Use CORS middleware
app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// Spawn the python prediction server
const pythonProcess = spawn('python', ['../api/predict_server.py']);

pythonProcess.stdout.on('data', (data) => {
    console.log(`Python stdout: ${data}`);
});

pythonProcess.stderr.on('data', (data) => {
    console.error(`Python stderr: ${data}`);
});

pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);
});

// Setup multer for file upload handling
const upload = multer();

// Proxy /predict requests to python server with file forwarding
app.post('/predict', upload.single('file'), async (req, res) => {
    try {
        const formData = new FormData();
        formData.append('file', req.file.buffer, req.file.originalname);

        const response = await axios.post('http://localhost:10000/predict', formData, {
            headers: {
                ...formData.getHeaders(),
                Authorization: req.headers.authorization || '',
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error proxying to python server:', error.message);
        res.status(500).json({ error: 'Prediction service error' });
    }
});

app.use('/api/diseases', diseasesRoutes);
app.use('/api/user', userRoutes);
const translationRoutes = require('./routes/translation');
app.use('/api/translation', translationRoutes);

// connect to db
mongoose.set("strictQuery", false);  // this is added to remove deprecation warning
// mongoose.connect("mongodb://127.0.0.1:27017/plantDisease")
mongoose.connect(process.env.MONGO_URL)
    .then((result) => {
        // Listen for requests:
        app.listen(process.env.PORT, () => {
            console.log('Connected to db and Listening on port', process.env.PORT);
        });
    })
    .catch((err) => {
        console.log(err);
    });
