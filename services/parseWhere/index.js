const { ApolloServer, gql, makeExecutableSchema } = require("apollo-server");
const ParseWhere = require("./data-source.js")

const typeDefs = gql`
  type Query {
    where(query: String!): [ResolvedLocality!]
  }

  type ResolvedLocality {
    display: String!
    precision: String!
    state: String!
    atlasId: String!
  }
`;

const resolvers = {
  Query: {
    where: async (_, args, { dataSources }) => {
      const result = await dataSources.parseWhere.search(args.query);
      return result.matchedLocations;
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
    parseWhere: new ParseWhere()
  })
});

server.listen({ port: 4007 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

