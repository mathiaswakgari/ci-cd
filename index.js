const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.port || 3000;

app.use(cors());
app.use(express.json());

require("./startup/db")();
require("./startup/routes")(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
