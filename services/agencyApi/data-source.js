const AWS = require('aws-sdk');

class AgencyAPI {
  constructor() {
    this.s3 = new AWS.S3({apiVersion: '2006-03-01'});
    this.bucket = "rea-agency-api-prod-ap-southeast-2";
  }

  async get(agencyId) {
    const request = this.s3.getObject({
      Bucket: this.bucket,
      Key: `${agencyId}.json`
    });

    const promise = request.promise();

    return promise.then(
      function(data) {
        const body = JSON.parse(data.Body.toString());
        return body;
      }
    );
  }
}

module.exports = AgencyAPI;
