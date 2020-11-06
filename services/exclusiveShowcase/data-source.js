const { RESTDataSource } = require("apollo-datasource-rest")

class ExclusiveShowcaseAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://api-ap-southeast-2.exclusive-showcase.realestate.com.au/";
  }

  async search(query) {
    return await this.get(`v1/search?query=${JSON.stringify(query)}`);
  }
}

module.exports = ExclusiveShowcaseAPI;
