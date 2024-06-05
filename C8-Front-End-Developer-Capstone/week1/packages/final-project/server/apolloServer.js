const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const mongoose = require('mongoose');
const { resolvers } = require("./apolloGQL/resolvers");
const { typeDefs } = require("./apolloGQL/models/typeDefs");

mongoose.connect('mongodb://localhost:27017/little-lemon', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to little-lemon database');
}).catch((err) => {
  console.log(err);
});

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.info(`🚀 Server ready at ${url}`);
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
