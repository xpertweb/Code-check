class WantedVisitModel {
  constructor(props) {
    this.visit = props.visit;
    this.butlersWantingThisVisit = props.butlersWantingThisVisit;
    this.butlersExcludedFromThisVisit = props.butlersExcludedFromThisVisit;
    this.butlersLeftOutOfThisVisit = props.butlersLeftOutOfThisVisit;
  }
}
module.exports = WantedVisitModel;