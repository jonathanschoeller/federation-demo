const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const ListingsSearchAPI = require("./data-source.js")
const ParseWhere = require("../parseWhere/data-source.js")

const typeDefs = gql`
  type Query {
    buySearch(query: SearchQueryJson!): BuyResolvedSearch!
  }

  scalar SearchQueryJson

  type BuyResolvedSearch @key(fields: "resolvedQuery") {
    results: BuySearchResults!
    resolvedQuery: ResolvedQuery!
  }

  type BuySearchResults {
    totalResultsCount: Int!
    exact: BuyExact!
  }

  type ResolvedQuery {
    localities: [ResolvedLocality!]!
  }

  type ResolvedLocality {
    display: String!
    precision: String!
    state: String!
    atlasId: String!
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
      const locationSearchText = args.query.locationSearches.map(locationSearch => locationSearch.locationSearchText).join(",");
      const result = await dataSources.parseWhere.search(locationSearchText);
      return {
        inputSearchQuery: args.query,
        resolvedSearchQuery: result.matchedLocations
      }
    }
  },
  BuyResolvedSearch: {
    __resolveReference: async(buyResolvedSearch, { dataSources }) => {
      const resolvedQuery = buyResolvedSearch.resolvedQuery;
      const lsapiQuery = {
        channel: "buy",
        locationSearches: resolvedQuery.localities.map(
          function(l) {
            const locality = {atlasId: l.atlasId};
            return locality;
          }
        )
      };

      return {
        inputSearchQuery: lsapiQuery,
        resolvedSearchQuery: resolvedQuery.localities
      };
    },
    resolvedQuery(buyResolvedSearch) {
      return {
        localities: buyResolvedSearch.resolvedSearchQuery
      };
    },
    results: async (buyResolvedSearch, _, { dataSources }) => {
      const response = await dataSources.listingsSearchAPI.search(buyResolvedSearch.inputSearchQuery);
      return response.results;
    }
  },
  BuySearchResultsItem: {
    listing(buySearchResultsItem) {
      return buySearchResultsItem;
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
      listingsSearchAPI: new ListingsSearchAPI(),
      parseWhere: new ParseWhere()
    })
});

server.listen({ port: 4006 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

