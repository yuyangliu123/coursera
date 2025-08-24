// server.js
const express = require('express');
const helmet = require('helmet');
const cors = require("cors");
const corsOptions = {
  origin: 'http://localhost:3000', // Change to your frontend's URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

const cookieParser = require('cookie-parser');

const { ApolloServer } = require('apollo-server-express');
const { resolvers } = require("./apolloGQL/resolvers");
const { typeDefs } = require("./apolloGQL/models/typeDefs");

const reservationRouter = require("./reservation")
const signupRouter = require("./signup")
const login2Router = require("./login2")
const logoutRouter = require("./logout")
const forgotpasswordRouter = require("./forgotpassword")
const authRouter = require("./routes/auth")
const apiRouter = require("./api")
const session = require('express-session');
const lightAuthenticate = require('./middleware/lightAuthenticate');
const authenticate = require('./middleware/authenticate');
const imgConverterRouter=require("./imgConverter")
const imagesRouter=require("./images")
const app = express();

//remove x-powered-by header
app.use((req, res, next) => {
  const send = res.send;
  res.send = (data) => {
    res.removeHeader('X-Powered-By');
    return send.call(res, data);
  };

  next();
});
app.use(helmet());
app.use(express.json());


app.use(cors(corsOptions));
//set sign of cookie
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  //the cookie will only be sent over HTTPS connection
  cookie: { secure: true }
}))

app.use("/reservation", reservationRouter);
app.use('/signup', signupRouter);
app.use('/login2', login2Router);
app.use('/logout', logoutRouter);
app.use('/forgotpassword', forgotpasswordRouter);
app.use("/auth", authRouter)
app.use("/api", apiRouter);
app.use("/img",imgConverterRouter)
app.use("/images",imagesRouter)

//Apollo Server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => {
    // use lightAuthenticate middleware for Query
    if (req.body.operationName === 'IntrospectionQuery' || req.body.query.includes('query')) {
      await new Promise((resolve, reject) => {
        lightAuthenticate(req, res, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
    // use authenticate middleware for Mutation
    else if (req.body.query.includes('mutation')) {
      await new Promise((resolve, reject) => {
        authenticate(req, res, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    return { user: req.user };
  },
});

// start Apollo Server
apolloServer.start().then(() => {
  // connect Apollo Server with Express
  apolloServer.applyMiddleware({ app, cors: corsOptions });

  app.listen(5000, () => console.log(`🚀 Server ready at http://localhost:5000${apolloServer.graphqlPath}`));
});
