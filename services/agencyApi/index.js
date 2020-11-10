const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const AgencyAPI = require("./data-source.js");

const typeDefs = gql`
  type Query {
    agency(id: String!): ListingCompany
  }

  type ListingCompany @key(fields: "id") {
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
  },
  ListingCompany: {
    __resolveReference: async(listingCompany, { dataSources }) => {
      return await dataSources.agencyApi.get(listingCompany.id);
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema(
    {
      typeDefs,
      resolvers
    }),
    dataSources: () => ({
      agencyApi: new AgencyAPI()
    })
});

server.listen({ port: 4008 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

