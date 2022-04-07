const assert = require('assert');
const { expect } = require('chai');
const helper = require('../../src/services/schedules/helper');
const queries = require('../../src/services/schedules/queries');


describe('schedules-helper', () => {

  it('parseWhereIn', () => {
    expect(helper.parseWhereIn([])).to.be.a('string', 'null');
    expect(helper.parseWhereIn([1,2,3])).to.be.a('string', '"1", "2", "3"');
    expect(helper.parseWhereIn([1,2,2,3])).to.be.a('string', '"1", "2", "3"');
  });

  it('workDayHash', () => {
    expect(helper.workDayHash('butlerId', '2012-01-01')).to.be.a('string', 'butlerId#2012-01-01');
  });


  it('analyseSchedule', () => {
    expect(helper.analyseSchedule({trunc:true})).to.deep.own.include({
      status: 'error',
      message: 'Schedule has too many visits to be computed (extra visits have been truncated)'
    });

    expect(helper.analyseSchedule({butlerAvailable:false})).to.deep.own.include({
      status: 'warning',
      message: 'Butler is not available or has incomplete address information on this day'
    });


    expect(helper.analyseSchedule({constraintsSatisfied:false})).to.deep.own.include({
      status: 'warning',
      message: 'Constraint has been violated'
    });


    expect(helper.analyseSchedule({butlerAvailable:true, trunc:false})).to.deep.own.include({status: 'ok'});
    expect(helper.analyseSchedule({xyz:false})).to.deep.own.include({status: 'ok'});
    expect(helper.analyseSchedule({id:'12121212'})).to.deep.own.include({status: 'ok'});
  });


  it('makeHashMap', () => {
    const hashMap = helper.makeHashMap([{
      id: 'workDayId',
      date: '2012-01-01',
      butlerId: 'butlerId'
    }]);

    expect(hashMap.get('butlerId#2012-01-01')).to.be.an('object')
      .that.has.all.keys('id', 'date', 'butlerId');

    const emptyMap = helper.makeHashMap([]);
    expect(emptyMap.get('butlerId#2012-01-01')).to.be.an('undefined');
    expect(emptyMap.get()).to.be.an('undefined');
  });

  it('collectClientServices', () => {
    const clientServices = helper.collectClientServices([{
      clientId: 'xyz',
    }]);

    assert.ok(Array.isArray(clientServices.get('xyz')), true);
    assert.ok(clientServices.get('xyz')[0].clientId,  'xyz');

    const emptyMap = helper.makeHashMap([]);
    assert(typeof(emptyMap.get('butlerId#2012-01-01')) === 'undefined');
  });


  it('nestAuxData', () => {
    const data = require('./nestAuxData.data.json');
    const struct = queries.nestAuxData(data);

    expect(struct.serviceHandovers.get('00191920-1255-11ea-a6b0-03fd61195df4'))
      .to.be.an('object')
      .to.include({
        id: '0bfeaaca-1255-11ea-9a93-cb955ff38996',
        serviceId: '00191920-1255-11ea-a6b0-03fd61195df4',
        note: 'mainly cleaning,ironing',
        creationDate: '2019-11-29',
      });

    expect(struct.services.get('43335d96-b3d0-11e7-940e-8b29a658d22c'))
      .to.be.an('object')
      .to.include({
        id: '43335d96-b3d0-11e7-940e-8b29a658d22c',
        clientId: '37edfca8-b3b6-11e7-b855-6705f888d166',
        genderPref: 'm',
        pets: false,
        errands: false,
        notes: null,
        visitGuaranteed: false,
        languageProf: null,
        clientRating: '0.00',
        clientLifetimeValue: '0.00',
        isOneOff: false,
        cancelFeeHasBeenWaived: false,
        defaultedVisit: false,
        spraysWipesAndBasicsRequired: false,
        isThirdPartyJob: false,
        couponCode: null,
        vacuumRequired: false,
        mopRequired: false,
        lastVisitCreationDate: null,
        lastVisitDate: null,
        active: false,
        serviceAllocated: false,
        isWhizzClient: null,
        disinfectantRequired: false,
        steamCleanerRequired: false,
        carpetDryCleaningRequired: false,
        endOfLeaseRequired: false,
        serviceLine: 'cleaning',
        furnitureAssemblyRequired: false,
        dateTimeCreated: null,
      });
  });

});
