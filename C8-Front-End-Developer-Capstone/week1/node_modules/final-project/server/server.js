const express = require('express');
const cors = require("cors");
const reservationRouter=require("./reservation")
const signupRouter=require("./signup")
const loginRouter=require("./login")
const login2Router=require("./login2")
const logoutRouter=require("./logout")
const forgotpasswordRouter=require("./forgotpassword")
const authRouter=require("./routes/auth")

const session = require('express-session');
const app = express();
app.use(express.json());
app.use(cors());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))

app.use("/reservation",reservationRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/login2', login2Router);
app.use('/logout', logoutRouter);
app.use('/forgotpassword', forgotpasswordRouter);
app.use("/auth",authRouter)


app.listen(5000, () => console.log('Server is running on port 5000'));