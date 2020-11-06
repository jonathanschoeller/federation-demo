const { ApolloServer, gql, makeExecutableSchema } = require("apollo-server");
const ExclusiveShowcaseAPI = require("./data-source.js")

const typeDefs = gql`
  type Query {
    exclusiveShowcase(atlasIds: [String!], channel: String): ExclusiveShowcase
  }

  type ExclusiveShowcase {
    bookingId: String!
    listingIds: [String!]
  }
`;

const resolvers = {
  Query: {
    exclusiveShowcase: async(_, args, { dataSources }) => {
      return await dataSources.exclusiveShowcaseAPI.search(args);
    }
  }
};

const server = new ApolloServer({
  schema: makeExecutableSchema(
    {
      typeDefs,
      resolvers
    }),
    dataSources: () => ({
      exclusiveShowcaseAPI: new ExclusiveShowcaseAPI()
    })
});

server.listen({ port: 4005 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

