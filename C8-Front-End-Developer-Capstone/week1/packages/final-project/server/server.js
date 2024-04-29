const express = require('express');
const cors = require("cors");
const reservationRouter=require("./reservation")
const signupRouter=require("./signup")
const loginRouter=require("./login")


const app = express();
app.use(express.json());
app.use(cors());

app.use("/reservation",reservationRouter)
app.use('/signup', signupRouter);
app.use('/login', loginRouter);


app.listen(5000, () => console.log('Server is running on port 5000'));