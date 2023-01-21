require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT;

require("./db/connection");

app.use(express.json());
app.use(cookieParser());
app.use(require("./router/auth"));

app.listen(PORT, () => {
  console.log(`server started on http://localhost:${PORT}`);
});
