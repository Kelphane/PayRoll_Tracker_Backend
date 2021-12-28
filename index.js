const express = require("express");
const cors = require("cors");
const connectDb = require("./db/db");
const employeeRouter = require("./routes/Employee");
const scheduleRouter = require("./routes/Schedule");
const userRouter = require("./routes/User");

const app = express();
const PORT = 5000;

connectDb();

app.use(cors());
app.use(express.json());
app.use("/api", employeeRouter, scheduleRouter, userRouter);


app.listen(PORT, () => {console.log(`Listening on Port: ${PORT}`)});

