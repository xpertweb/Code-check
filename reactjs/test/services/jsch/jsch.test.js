const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-roughly'));
const { generateSchedule, generateScheduleDelta } = require('../../../src/services/schedules/jsch');
const { LocalTime } = require('js-joda');

describe('jsch module', function () {
  this.timeout(6000);
  const getAnchoredVisitByOrigIdx = (r, idx) => {
    return r.anchoredVisits.filter(av => av.visitIdx === idx)[0];
  };

  describe('generateSchedule()', () => {
    it('anchored visits do not overlap', () => {
      const visits = [
        {
          windowStartTime: '09:00:00',
          windowEndTime: '12:00:00',
          duration: '01:00:00',
          geopoint: { lat: 0.0, lng: 0.0 }
        },
        {
          windowStartTime: '09:00:00',
          windowEndTime: '12:00:00',
          duration: '01:00:00',
          geopoint: { lat: 0.0, lng: 0.0 }
        }
      ];

      const butlerWorkDay = {
        windowStartTime: '09:00:00',
        windowEndTime: '12:00:00',
        butlerAddressGeopoint: { lat: 0.0, lng: 0.0 }
      };

      return generateSchedule(visits, butlerWorkDay, true).then(r => {
        const visit0 = getAnchoredVisitByOrigIdx(r, 0);
        const visit1 = getAnchoredVisitByOrigIdx(r, 1);

        expect(LocalTime.parse(visit0.endTime) <= LocalTime.parse(visit1.startTime)).to.be.true;
      });
    });

    it('visits are reordered according to time window constraints', () => {
      const visits = [
        {
          windowStartTime: '11:00:00',
          windowEndTime: '12:00:00',
          duration: '01:00:00',
          geopoint: { lat: 0.0, lng: 0.0 }
        },
        {
          windowStartTime: '09:00:00',
          windowEndTime: '12:00:00',
          duration: '01:00:00',
          geopoint: { lat: 0.0, lng: 0.0 }
        }
      ];

      const butlerWorkDay = {
        windowStartTime: '09:00:00',
        windowEndTime: '12:00:00',
        butlerAddressGeopoint: { lat: 0.0, lng: 0.0 }
      };

      return generateSchedule(visits, butlerWorkDay, true).then(r => {
        expect(r.anchoredVisits[0].visitIdx).to.equal(1);
        expect(r.anchoredVisits[1].visitIdx).to.equal(0);
      });
    });

    it('visits conform to time window constraints', () => {
      const visits = [
        {
          windowStartTime: '11:00:00',
          windowEndTime: '12:00:00',
          duration: '01:00:00',
          geopoint: { lat: 0.0, lng: 0.0 }
        },
        {
          windowStartTime: '09:00:00',
          windowEndTime: '12:00:00',
          duration: '01:00:00',
          geopoint: { lat: 0.0, lng: 0.0 }
        }
      ];

      const butlerWorkDay = {
        windowStartTime: '09:00:00',
        windowEndTime: '12:00:00',
        butlerAddressGeopoint: { lat: 0.0, lng: 0.0 }
      };

      return generateSchedule(visits, butlerWorkDay, true).then(r => {
        const visit0 = getAnchoredVisitByOrigIdx(r, 0);
        const visit1 = getAnchoredVisitByOrigIdx(r, 1);

        expect(LocalTime.parse(visit0.startTime) >= LocalTime.parse(visits[0].windowStartTime)).to.be.true;
        expect(LocalTime.parse(visit0.endTime) <= LocalTime.parse(visits[0].windowEndTime)).to.be.true;

        expect(LocalTime.parse(visit1.startTime) >= LocalTime.parse(visits[1].windowStartTime)).to.be.true;
        expect(LocalTime.parse(visit1.endTime) <= LocalTime.parse(visits[1].windowEndTime)).to.be.true;
      });
    });

    it('visits conform to butler work window constraints', () => {
      const visits = [
        {
          windowStartTime: '07:00:00',
          windowEndTime: '18:00:00',
          duration: '01:00:00',
          geopoint: { lat: 0.0, lng: 0.0 }
        },
        {
          windowStartTime: '07:00:00',
          windowEndTime: '18:00:00',
          duration: '01:00:00',
          geopoint: { lat: 0.0, lng: 0.0 }
        }
      ];

      const butlerWorkDay = {
        windowStartTime: '10:00:00',
        windowEndTime: '13:00:00',
        butlerAddressGeopoint: { lat: 0.0, lng: 0.0 }
      };

      return generateSchedule(visits, butlerWorkDay, true).then(r => {
        r.anchoredVisits.forEach(anchoredVisit => {
          expect(LocalTime.parse(anchoredVisit.startTime) >= LocalTime.parse(butlerWorkDay.windowStartTime)).to.be.true;
          expect(LocalTime.parse(anchoredVisit.endTime) <= LocalTime.parse(butlerWorkDay.windowEndTime)).to.be.true;
        });
      });
    });

    it('correct cost is calculated for schedule', () => {
      const visits = [
        {
          windowStartTime: '09:00:00',
          windowEndTime: '12:00:00',
          duration: '01:00:00',
          geopoint: { lat: 0.0, lng: 0.0 }
        },
        {
          windowStartTime: '09:00:00',
          windowEndTime: '12:00:00',
          duration: '01:00:00',
          geopoint: { lat: 0.0, lng: 0.0 }
        }
      ];

      const butlerWorkDay = {
        windowStartTime: '09:00:00',
        windowEndTime: '12:00:00',
        butlerAddressGeopoint: { lat: 0.0, lng: 0.0 }
      };

      // Expect visits are packed fully
      // 15 mins + 60 mins + 15 mins + 60 mins + 15 mins = 2.75 hours
      // Thus, cost should be 2.75

      return generateSchedule(visits, butlerWorkDay, true).then(r => {
        expect(r.cost).to.roughly.deep.equal(2.75);
      });
    });

    it('cost is higher when no car', () => {
      const visits = [
        {
          windowStartTime: '09:00:00',
          windowEndTime: '12:00:00',
          duration: '01:00:00',
          geopoint: { lat: 37.0098419, lng: 145.0295944 }
        },
        {
          windowStartTime: '09:00:00',
          windowEndTime: '12:00:00',
          duration: '01:00:00',
          geopoint: { lat: 37.9098419, lng: 145.1295944 } // Important to ensure there is some distance
        }
      ];

      const butlerWorkDay = {
        windowStartTime: '09:00:00',
        windowEndTime: '12:00:00',
        butlerAddressGeopoint: { lat: 0.0, lng: 0.0 }
      };

      return generateSchedule(visits, butlerWorkDay, true).then(r => {
        return generateSchedule(visits, butlerWorkDay, false).then(rWithoutCar => {
          expect(r.cost).to.be.below(rWithoutCar.cost);
        });
      });
    });

    it('correct cost is calculated for schedule with only one visit', () => {
      const visits = [
        {
          windowStartTime: '09:00:00',
          windowEndTime: '12:00:00',
          duration: '01:00:00',
          geopoint: { lat: 0.0, lng: 0.0 }
        }
      ];

      const butlerWorkDay = {
        windowStartTime: '09:00:00',
        windowEndTime: '12:00:00',
        butlerAddressGeopoint: { lat: 0.0, lng: 0.0 }
      };

      // Expect visits are packed fully
      // 15 mins + 60 mins + 15 mins = 1.5 hours
      // Thus, cost should be 1.5

      return generateSchedule(visits, butlerWorkDay, true).then(r => {
        expect(r.cost).to.roughly.deep.equal(1.5);
      });
    });

    it('correct efficiency is calculated for schedule', () => {
      const visits = [
        {
          windowStartTime: '09:00:00',
          windowEndTime: '12:00:00',
          duration: '01:00:00',
          geopoint: { lat: 0.0, lng: 0.0 }
        },
        {
          windowStartTime: '09:00:00',
          windowEndTime: '12:00:00',
          duration: '01:00:00',
          geopoint: { lat: 0.0, lng: 0.0 }
        }
      ];

      const butlerWorkDay = {
        windowStartTime: '09:00:00',
        windowEndTime: '12:00:00',
        butlerAddressGeopoint: { lat: 0.0, lng: 0.0 }
      };

      // Expect visits are packed fully
      // Cost is 2.75 as above (same as total time)
      // Therefore efficiency is 2.0/2.75 = 0.727 (work time / total time)

      return generateSchedule(visits, butlerWorkDay, true).then(r => {
        expect(r.efficiency).to.roughly.deep.equal(2.0/2.75);
      });
    });

    it('constraintsSatisfied becomes false when visits too long for butler time window', () => {
      const visitsOK = [
        {
          windowStartTime: '09:00:00',
          windowEndTime: '12:00:00',
          duration: '01:00:00',
          geopoint: { lat: 0.0, lng: 0.0 }
        },
        {
          windowStartTime: '09:00:00',
          windowEndTime: '12:00:00',
          duration: '01:30:00',
          geopoint: { lat: 0.0, lng: 0.0 }
        }
      ];

      const visitsNotOK = [
        {
          windowStartTime: '09:00:00',
          windowEndTime: '12:00:00',
          duration: '01:00:00',
          geopoint: { lat: 0.0, lng: 0.0 }
        },
        {
          windowStartTime: '09:00:00',
          windowEndTime: '12:00:00',
          duration: '02:00:00', // 3 hours in total, however there will be additional travel time
          geopoint: { lat: 0.0, lng: 0.0 }
        }
      ];

      const butlerWorkDay = {
        windowStartTime: '09:00:00',
        windowEndTime: '12:00:00',
        butlerAddressGeopoint: { lat: 0.0, lng: 0.0 }
      };

      return generateSchedule(visitsOK, butlerWorkDay, true).then(r => {
        expect(r.constraintsSatisfied).to.be.true;

        return generateSchedule(visitsNotOK, butlerWorkDay, true);
      }).then(r => {
        expect(r.constraintsSatisfied).to.be.false;
      });
    });

    it('visits are ordered based on location if no other restricting constraints', () => {
      // Note we keep windows wide to test this functionality. Window constraints
      // take precedence over an optimal visit location order.
      const visits = [
        {
          windowStartTime: '07:00:00',
          windowEndTime: '23:00:00',
          duration: '01:00:00',
          geopoint: { lat: -37.829000, lng: 144.957000 } // Southbank VIC
        },
        {
          windowStartTime: '07:00:00',
          windowEndTime: '23:00:00',
          duration: '01:00:00',
          geopoint: { lat: -37.743800, lng: 144.964500 } // Coburg VIC
        },
        {
          windowStartTime: '07:00:00',
          windowEndTime: '23:00:00',
          duration: '01:00:00',
          geopoint: { lat: -37.798000, lng: 144.899000 } // Footscray VIC
        },
        {
          windowStartTime: '07:00:00',
          windowEndTime: '23:00:00',
          duration: '01:00:00',
          geopoint: { lat: -37.792000, lng: 145.011000 } // Fairfield VIC
        }
      ];

      const butlerWorkDay = {
        windowStartTime: '07:00:00',
        windowEndTime: '23:00:00',
        butlerAddressGeopoint: { lat: -37.743000, lng: 145.008000 } // Preston VIC
      };

      // By observation we expect the optimal route to be:
      // Preston -> Fairfield (3) -> Southbank (0) -> Footscray (2) -> Coburg (0) -> Preston
      // ...OR the reverse

      return generateSchedule(visits, butlerWorkDay, true).then(r => {
        if (r.anchoredVisits[0].visitIdx === 3) {
          expect(r.anchoredVisits.map(v => v.visitIdx)).to.have.ordered.members([3, 0, 2, 1]);
        } else {
          expect(r.anchoredVisits.map(v => v.visitIdx)).to.have.ordered.members([1, 2, 0, 3]);
        }
      });
    });
  });

  describe('generateScheduleDelta()', () => {
    it('correct cost delta is calculated for schedule difference', () => {
      const visits = [
        {
          windowStartTime: '09:00:00',
          windowEndTime: '12:00:00',
          duration: '01:00:00',
          geopoint: { lat: 0.0, lng: 0.0 }
        }
      ];

      const addedVisit = {
        windowStartTime: '09:00:00',
        windowEndTime: '12:00:00',
        duration: '01:00:00',
        geopoint: { lat: 0.0, lng: 0.0 }
      };

      const butlerWorkDay = {
        windowStartTime: '09:00:00',
        windowEndTime: '12:00:00',
        butlerAddressGeopoint: { lat: 0.0, lng: 0.0 }
      };

      // Expect visits are packed fully
      // Before: 15 mins + 60 mins + 15 mins = 1.5 hours
      // After 15 mins + 60 mins + 15 mins + 60 mins + 15 mins = 2.75 hours
      // Thus, cost delta should be +1.25

      return generateScheduleDelta(visits, addedVisit, butlerWorkDay, true).then(r => {
        expect(r.deltaCost).to.roughly.deep.equal(1.25);
      });
    });

    it('correct efficiency delta is calculated for schedule difference', () => {
      const visits = [
        {
          windowStartTime: '09:00:00',
          windowEndTime: '12:00:00',
          duration: '01:00:00',
          geopoint: { lat: 0.0, lng: 0.0 }
        }
      ];

      const addedVisit = {
        windowStartTime: '09:00:00',
        windowEndTime: '12:00:00',
        duration: '01:00:00',
        geopoint: { lat: 0.0, lng: 0.0 }
      };

      const butlerWorkDay = {
        windowStartTime: '09:00:00',
        windowEndTime: '12:00:00',
        butlerAddressGeopoint: { lat: 0.0, lng: 0.0 }
      };

      // Expect visits are packed fully
      // Before: 15 mins + 60 mins + 15 mins = 1.5 hours => efficiency = 1/1.5 = 0.66667
      // After 15 mins + 60 mins + 15 mins + 60 mins + 15 mins = 2.75 hours => efficiency = 2/2.75 = 0.72727
      // Thus, efficiency delta should be +0.06061

      return generateScheduleDelta(visits, addedVisit, butlerWorkDay, true).then(r => {
        expect(r.deltaEfficiency).to.roughly.deep.equal(2/2.75 - 1/1.5);
      });
    });

    it('included schedule is the full (appended) schedule', () => {
      const visits = [
        {
          windowStartTime: '09:00:00',
          windowEndTime: '12:00:00',
          duration: '01:00:00',
          geopoint: { lat: 0.0, lng: 0.0 }
        }
      ];

      const addedVisit = {
        windowStartTime: '09:00:00',
        windowEndTime: '12:00:00',
        duration: '01:00:00',
        geopoint: { lat: 0.0, lng: 0.0 }
      };

      const butlerWorkDay = {
        windowStartTime: '09:00:00',
        windowEndTime: '12:00:00',
        butlerAddressGeopoint: { lat: 0.0, lng: 0.0 }
      };

      return generateScheduleDelta(visits, addedVisit, butlerWorkDay, true).then(r => {
        expect(r.anchoredVisits).to.have.lengthOf(2);
      });
    });
  });
});
