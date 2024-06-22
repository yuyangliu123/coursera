// server.js
const express = require('express');
const cors = require("cors");
const corsOptions = {
	origin: 'http://localhost:3000', // Change to your frontend's URL
	credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  };
const cookieParser = require('cookie-parser');
const { ApolloServer } = require('apollo-server-express');
const { resolvers } = require("./apolloGQL/resolvers");
const { typeDefs } = require("./apolloGQL/models/typeDefs");

const reservationRouter=require("./reservation")
const signupRouter=require("./signup")
const login2Router=require("./login2")
const logoutRouter=require("./logout")
const forgotpasswordRouter=require("./forgotpassword")
const authRouter=require("./routes/auth")
const apiRouter=require("./api")

const session = require('express-session');
const app = express();
app.use(express.json());
app.use(cors(corsOptions));
//set sign of cookie
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use("/reservation",reservationRouter);
app.use('/signup', signupRouter);
app.use('/login2', login2Router);
app.use('/logout', logoutRouter);
app.use('/forgotpassword', forgotpasswordRouter);
app.use("/auth",authRouter)
app.use("/api",apiRouter);

// 建立 Apollo Server
const apolloServer = new ApolloServer({ typeDefs, resolvers });

// 開始 Apollo Server
apolloServer.start().then(() => {
  // 將 Apollo Server 與 Express 應用程式連接
  apolloServer.applyMiddleware({ app });

  app.listen(5000, () => console.log(`🚀 Server ready at http://localhost:5000${apolloServer.graphqlPath}`));
});
