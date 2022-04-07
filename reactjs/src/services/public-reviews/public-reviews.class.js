
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {

    const result = await this.app.service('serviceFeedback').find({
      query : {
        score : {
          $gte : 4
        },
        comment: {
          $ne : null
        },
        $limit : 24,
        doNotShareFeedbackWithButler: false
      }
    });

    const sortedByLengthOfComment = result.sort((a,b)=>{
      return b.comment.length - a.comment.length;
    });

    const publicDataResults = sortedByLengthOfComment.map(x=> {
      return {
        comment : x.comment,
        score : x.score,
        visitDate : x.visitDate,
        butlerFirstName: (x.butler || {}).firstName,
        firstName : x.service.client.firstName,
        locale : x.service.address.locale,
        state : x.service.address.state
      };
    });
    
    if (publicDataResults.length > 12){
      publicDataResults.splice(12,12);
      return Promise.resolve(publicDataResults);
    } else {
      return Promise.resolve(publicDataResults);
    }
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
