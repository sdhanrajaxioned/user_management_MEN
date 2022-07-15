const express = require("express");
const app = express();

const port = process.env.PORT || 3000; // use port 3000 unless there exists a preconfigured port

//route for homepage
app.get('/', (_req, res) => {
  res.status(200).send("Homepage");
});

//server hosted
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
})