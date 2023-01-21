const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log(`connection successful`);
  })
  .catch((e) => console.log(`no connection`));
