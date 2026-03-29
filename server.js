const express = require("express");
const connectDB = require(`${__dirname}/config/DB`);
require("dotenv").config();

const app = express();
app.use(express.json());
connectDB();
// routes
const cropRoute = require(`${__dirname}/routes/cropRoute`);
const farmActivityRoute = require(`${__dirname}/routes/farmActivityRoute`);
const farmRoute = require(`${__dirname}/routes/farmRoute`);
const goodsRoute = require(`${__dirname}/routes/goodsRoute`);
const orderRoute = require(`${__dirname}/routes/orderRoute`);
const userRoute = require(`${__dirname}/routes/userRoute`);

app.use("/crop", cropRoute);
app.use("/farmActivity", farmActivityRoute);
app.use("/farm", farmRoute);
app.use("/good", goodsRoute);
app.use("/order", orderRoute);
app.use("/user", userRoute);

// server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
