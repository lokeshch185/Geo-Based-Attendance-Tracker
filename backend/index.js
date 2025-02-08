require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { checkScheduleAndNotify } = require('./services/AttendenceTracker.js');

const subjectRoutes = require("./routes/subjectRoutes.js");
const attendanceRoutes = require("./routes/attendanceRoutes");
const floorPlanRoutes = require("./routes/floorPlanRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/subjects", subjectRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/floorplan", floorPlanRoutes);
app.get("/", (req, res) => {
  res.send("Server is running");
});
setInterval(checkScheduleAndNotify, 60000);

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.log(err));
