const { ApolloServer, gql, makeExecutableSchema } = require("apollo-server");
const AgencyAPI = require("./data-source.js");

const typeDefs = gql`
  type Query {
    agency(id: String!): ListingCompany
  }

  type ListingCompany {
    id: String!
    name: String!
    businessPhone: String!
    description: String!
  }
`;

const resolvers = {
  Query: {
    agency: async(_, args, { dataSources }) => {
      return await dataSources.agencyApi.get(args.id);
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
      agencyApi: new AgencyAPI()
    })
});

server.listen({ port: 4002 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

