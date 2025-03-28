const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/task.routes');
const authRoutes = require("./routes/auth.routes")
const cookieParser = require("cookie-parser")


dotenv.config()

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(cors())
app.use('/tasks', taskRoutes);
app.use('/auth', authRoutes);

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
  });
  