const express = require("express");
const app = express();
const sa = require('./routes/sa')
app.use(express.json());
var cors = require("cors");
app.use(cors());
app.get("/", (req, res) => {
    res.send("TEst")});

// use router houses.js
app.use("/sa",sa)

const port =   3300;

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
