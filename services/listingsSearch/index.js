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
    listingCompany: ListingCompany
  }

  type ListingCompany {
    id: String!
  }

  scalar ListingId
`;

const resolvers = {
  Query: {
    buySearch: async(_, args) => {
      return {
        inputSearchQuery: args.query
      }
    }
  },
  BuyResolvedSearch: {
    results: async (buyResolvedSearch, _, { dataSources }) => {
      const response = await dataSources.listingsSearchAPI.search(buyResolvedSearch.inputSearchQuery);
      return response.results;
    }
  },
  BuySearchResultsItem: {
    listing(buySearchResultsItem) {
      return buySearchResultsItem;
    }
  },
  BuyListing: {
    listingCompany(buyListing) {
      return buyListing.agency;
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

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

