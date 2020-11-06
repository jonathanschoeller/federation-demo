const { RESTDataSource } = require("apollo-datasource-rest")

class ParseWhere extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://www.realestate.com.au/";
  }

  async search(where) {
    return await this.get(`parsewhere.ds?where=${where}`);
  }
}

module.exports = ParseWhere;
