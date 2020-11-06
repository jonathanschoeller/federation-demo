const { ApolloServer, gql, makeExecutableSchema } = require("apollo-server");
const ListingsSearchAPI = require("./data-source.js")

const typeDefs = gql`
  type Query {
    buySearch(query: SearchQueryJson!): BuyResolvedSearch!
  }

  scalar SearchQueryJson

  type BuyResolvedSearch {
    results: BuySearchResults!
  }

  type BuySearchResults {
    totalResultsCount: Int!
    exact: BuyExact!
  }

  type BuyExact {
    items: [BuySearchResultsItem!]!
    totalCount: Int!
  }

  type BuySearchResultsItem {
    listing: BuyListing!
  }

  type BuyListing {
    id: ListingId!
    description: String! 
  }

  scalar ListingId
`;

const resolvers = {
  Query: {
    buySearch: async(_, args, { dataSources }) => {
      return await dataSources.listingsSearchAPI.search(args.query);
    }
  },
  BuySearchResultsItem: {
    listing(buySearchResultsItem) {
      return buySearchResultsItem;
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
      listingsSearchAPI: new ListingsSearchAPI()
    })
});

server.listen({ port: 4006 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

