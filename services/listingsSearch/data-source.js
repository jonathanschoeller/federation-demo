const { RESTDataSource } = require("apollo-datasource-rest")

class ListingsSearchAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://lsapi-ap-southeast-2.listings-search-pipeline.resi-property.realestate.com.au/";
  }

  async search(query) {
    return await this.get(`services/listings/search?query=${JSON.stringify(query)}`);
  }
}

module.exports = ListingsSearchAPI;
