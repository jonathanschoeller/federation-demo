const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const ListingsSearchAPI = require("./data-source.js")
const ParseWhere = require("../parseWhere/data-source.js")

const typeDefs = gql`
  type Query {
    buySearch(query: SearchQueryJson!): BuyResolvedSearch!
  }

  scalar SearchQueryJson

  type BuyResolvedSearch {
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
    listingCompany: ListingCompany @provides(fields: "id")
  }

  extend type ListingCompany @key(fields: "id") {
    id: String! @external
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
  BuySearchResultsItem: {
    listing(buySearchResultsItem) {
      return buySearchResultsItem;
    }
  },
  BuyListing: {
    listingCompany(buyListing) {
      return { __typename: "ListingCompany", id: buyListing.agency.id}
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

