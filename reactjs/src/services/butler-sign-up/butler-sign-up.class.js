
const { LocalDate } = require('js-joda');
const logger = require('winston');
const {sendEmail} = require('../../helpers/send-email');
const butlerSignedUpSuccessTemplate = require('../../mail-templates/butler-signed-up-success-template');
const axios = require('axios');
const getServerProtocol = require('../../helpers/get-server-protocol');
const {authenticateAgainstLeadsPlatform} = require('../../helpers/authenticate-against-leads-platform');
const winston = require('winston');
const _ = require('lodash');

class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
    this.knex = this.app.get('knexClient');
  }

  // eslint-disable-next-line no-unused-vars
  async create( data, params, moreData) { // this is the logic to grant visits

    const {
      address, 
      firstName, 
      lastName, 
      gender, 
      phoneNumber, 
      email, 
      cleaningExp, 
      bankAccountName,
      bankBsbNumber,
      bankAccountNumber,
      cleaningExperienceAtAnotherHomeCleaningCompany, 
      cleaningExperienceAtCommercialCleaningCompany,
      cleaningExperienceAtHotel,
      cleaningExperienceAtOneOrMorePrivateProperties,
      canDoCleaning,
      candoIroning,
      canDoTidying,
      canDoWashing,
      password,
      canDoLaundry,
      canDoDogWalking,
      canDoOtherTaskThanPredefined,
      howWouldTheButlerTidyARoom,
      tellUsAboutYourselfNotes,
      butlerCurriculumFiles,
      curriculumPlainText,
      butlerRefereePhoneNumber,
      languageProf,
      ieltsExamScore,
      nativeEnglishSpeaker,
      passedPteExam,
      pteExamScore,
      passedIeltsExam,
      hasWorkingRightsInAustralia,
      expectedLivingInAustraliaPeriod,
      hasPoliceCheckOrWillGetOneWhenStartingWithUs,
      abnNumber,
      hasCar,
      canCommitToWorkSameDaysEachWeek,
      cannotHandlePets,
      whereDidButlerHearAboutUs,


      isStayAtHomeMum,
      isInternationalStudent,
      isHolidayWorker,
      isCareerCleanerOrHousekeeper,
      

      workingHoursPerWeekIdeally,
      howLongWouldButlerWorkWithUs,
      reasonsButlerMayLeaveInComingMonths,
      answersGivenThruthfully,
      previosulyWorkedOnCleaningPlatforms,
      vacuumProvided,
      mopProvided,
      spraysWipesAndBasicsProvided,
      hasPublicLiabilityInsurance,
      availabilityStartDate,
      availabilityEndDate,
      dateOfBirth,
      canWorkMonday,
      canWorkTuesday,
      canWorkWednesday,
      canWorkThursday,
      canWorkFriday,
      canWorkSaturday,
      canWorkSunday,
      mondayStartTime,
      mondayEndTime,
      tuesdayStartTime,
      tuesdayEndTime,
      wednesdayStartTime,
      wednesdayEndTime,
      thursdayStartTime,
      thursdayEndTime,
      fridayStartTime,
      fridayEndTime,
      saturdayStartTime,
      saturdayEndTime,
      sundayStartTime,
      sundayEndTime,

      referenceCheck,
      englishCheck,
      onboardedOntoPlatform,
      vacuumSuppliedByJarvis,
      vacuumReturnedToJarvis,
      steamCleanerProvided,
      carpetDryCleaningProvided,
      endOfLeaseProvided,
      disinfectantProvided,
      furnitureAssemblyProvided,
      packingServiceProvided,
      gardeningServiceProvided
    } = data;
    
    let logsToSend = "Starting signup process " + email + ' ' + phoneNumber; 
    winston.info({event:'starting', lastName}, {tags:'butler-signup'})

    let curriculumUrl;
   
    if (butlerCurriculumFiles && butlerCurriculumFiles[0]){
      winston.info({event:'upload-curriculum', lastName}, {tags:'butler-signup'});
      logsToSend += " - uploading curriculum";
      const blob = {
        uri: butlerCurriculumFiles[0]
      };
      // update butlerCurriculumFiles
      curriculumUrl = await this.app.service('fileUploader').create(blob);
      winston.info({event:'upload-curriculum-success', lastName}, {tags:'butler-signup'});
      logsToSend += " - uploaded curriculum";
    }
    winston.info({event:'create-account', lastName}, {tags:'butler-signup'});
    logsToSend += " - creating account";
    const createdButler = await this.app.service('butlers').create({
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      email: email,
      password: password,
      gender: gender,
      curriculumUrl: (curriculumUrl ? `${process.env.AWS_S3_URL}/${process.env.AWS_IMAGES_S3_BUCKET}/${curriculumUrl.id}` : ''),
      rating: 5,
      managedSchedule: false,
      onFreeze: true,
      spraysWipesAndBasicsProvided: spraysWipesAndBasicsProvided,
      vacuumProvided: vacuumProvided,
      mopProvided: mopProvided,
      packingServiceProvided: packingServiceProvided,
      handlesPets: !cannotHandlePets,
      hasCar: hasCar,
      maxTravelDistance: 25000,
      languageProf: languageProf,
      cleaningExp: cleaningExp,
      preferredContact: 'm',
      canDoOtherTaskThanPredefined: canDoOtherTaskThanPredefined,
      cleaningExperienceAtAnotherHomeCleaningCompany: cleaningExperienceAtAnotherHomeCleaningCompany,
      cleaningExperienceAtCommercialCleaningCompany: cleaningExperienceAtCommercialCleaningCompany,
      cleaningExperienceAtHotel: cleaningExperienceAtHotel,
      cleaningExperienceAtOneOrMorePrivateProperties: cleaningExperienceAtOneOrMorePrivateProperties,
      howWouldTheButlerTidyARoom: howWouldTheButlerTidyARoom,
      tellUsAboutYourselfNotes: tellUsAboutYourselfNotes,
      curriculumPlainText: curriculumPlainText,
      butlerRefereePhoneNumber: butlerRefereePhoneNumber,
      passedIeltsExam: passedIeltsExam,
      ieltsExamScore: ieltsExamScore,
      passedPteExam: passedPteExam,
      nativeEnglishSpeaker: nativeEnglishSpeaker,
      pteExamScore: pteExamScore,
      activeClients: 0,
      hasWorkingRightsInAustralia : hasWorkingRightsInAustralia,
      expectedLivingInAustraliaPeriod: expectedLivingInAustraliaPeriod,
      hasPoliceCheckOrWillGetOneWhenStartingWithUs: hasPoliceCheckOrWillGetOneWhenStartingWithUs,
      abnNumber: abnNumber,
      canCommitToWorkSameDaysEachWeek: canCommitToWorkSameDaysEachWeek,
      whereDidButlerHearAboutUs: whereDidButlerHearAboutUs,
      dateOfBirth: dateOfBirth,
      isStayAtHomeMum: isStayAtHomeMum,
      isInternationalStudent: isInternationalStudent,
      isHolidayWorker: isHolidayWorker,
      isCareerCleanerOrHousekeeper: isCareerCleanerOrHousekeeper,

      workingHoursPerWeekIdeally: workingHoursPerWeekIdeally,
      howLongWouldButlerWorkWithUs: howLongWouldButlerWorkWithUs,
      reasonsButlerMayLeaveInComingMonths: reasonsButlerMayLeaveInComingMonths,
      previosulyWorkedOnCleaningPlatforms: previosulyWorkedOnCleaningPlatforms,
      answersGivenThruthfully: answersGivenThruthfully,
      hasPublicLiabilityInsurance: hasPublicLiabilityInsurance,

      referenceCheck: referenceCheck,
      englishCheck: englishCheck,
      onboardedOntoPlatform: onboardedOntoPlatform,

      vacuumSuppliedByJarvis: vacuumSuppliedByJarvis,
      vacuumReturnedToJarvis: vacuumReturnedToJarvis,
      disinfectantProvided:disinfectantProvided,
      steamCleanerProvided:steamCleanerProvided,
      carpetDryCleaningProvided:carpetDryCleaningProvided,
      endOfLeaseProvided: endOfLeaseProvided,
      furnitureAssemblyProvided: furnitureAssemblyProvided,
      packingServiceProvided:packingServiceProvided,
      gardeningServiceProvided:gardeningServiceProvided
    });

    logsToSend += " - created account";
    winston.info({event:'create-account-success', lastName}, {tags:'butler-signup'});
  
    let createdWorkBlocks;
    let createdBankDetails;
    let createdButlerAddress;
    let createdButlerSkills;
    try {

      winston.info({event:'create-tasks', lastName}, {tags:'butler-signup'});
      logsToSend += " - creating tasks";
    const tasks = await this.app.service('tasks').find();
    const butlerTasksToCreate = [];
    if (canDoCleaning){
      butlerTasksToCreate.push({
        taskId: tasks.find(x=> x.name == 'Cleaning').id,
        butlerId: createdButler.id
      });
    };
    if (candoIroning){
      butlerTasksToCreate.push({
        taskId: tasks.find(x=> x.name == 'Ironing').id,
        butlerId: createdButler.id
      });
    };
    if (canDoTidying){
      butlerTasksToCreate.push({
        taskId: tasks.find(x=> x.name == 'Tidying').id,
        butlerId: createdButler.id
      });
    };
    if (canDoWashing){
      butlerTasksToCreate.push({
        taskId: tasks.find(x=> x.name == 'Washing').id,
        butlerId: createdButler.id
      });
    };
    if (canDoLaundry){
      butlerTasksToCreate.push({
        taskId: tasks.find(x=> x.name == 'Laundry').id,
        butlerId: createdButler.id
      });
    };
    if (canDoDogWalking){
      butlerTasksToCreate.push({
        taskId: tasks.find(x=> x.name == 'dog walking').id,
        butlerId: createdButler.id
      });
    };
    createdButlerSkills = await Promise.all(butlerTasksToCreate.map(x=> {
      return this.app.service('butlerSkills').create(x);
    }));
    logsToSend += " - created tasks";
    winston.info({event:'create-tasks-success', lastName}, {tags:'butler-signup'});

    //create butler address
    winston.info({event:'create-address', lastName}, {tags:'butler-signup'});
    logsToSend += " - creating address";
    createdButlerAddress = await this.app.service('butlerAddresses').create({
      line1: address.line1,
      line2: address.line2,
      locale: address.locale,
      state: address.state,
      postcode: address.postcode,
      country: address.country,
      butlerId: createdButler.id,
      activeFrom: LocalDate.now().toString()
    });
    logsToSend += " - created address";
    winston.info({event:'create-address-success', lastName}, {tags:'butler-signup'});

    
    const workBlocksToBeCreated = [];
    const dateStartedCreatingWorkBlocks = LocalDate.parse(availabilityStartDate);
    let dateEndingCreatingWorkBlocks;
    
    if (availabilityEndDate){
      dateEndingCreatingWorkBlocks = LocalDate.parse(availabilityEndDate)
    }

    for (let x = 0; x < 7; x++){ //here we create a sequence of days, starting on start date and ending on last day the butler wants to work
      
      const upcomingDate = dateStartedCreatingWorkBlocks.plusDays(x);
      const upcomingDay = upcomingDate.dayOfWeek();
      
      logsToSend += " - creating  workblocks";
      switch (upcomingDay.ordinal()) {
        case 0: // monday
          if (canWorkMonday){
            workBlocksToBeCreated.push({
              butlerId: createdButler.id,
              startDate: upcomingDate.toString(),
              endDate: (dateEndingCreatingWorkBlocks ? dateEndingCreatingWorkBlocks.toString() : undefined),
              windowStartTime: mondayStartTime,
              windowEndTime: mondayEndTime
            });
          }
          break;
        case 1: // tuesday
          if (canWorkTuesday){
            workBlocksToBeCreated.push({
              butlerId: createdButler.id,
              startDate: upcomingDate.toString(),
              endDate: (dateEndingCreatingWorkBlocks ? dateEndingCreatingWorkBlocks.toString() : undefined),
              windowStartTime: tuesdayStartTime,
              windowEndTime: tuesdayEndTime
            });
          }
          break;
        case 2: // wednesday
          if (canWorkWednesday){
            workBlocksToBeCreated.push({
              butlerId: createdButler.id,
              startDate: upcomingDate.toString(),
              endDate: (dateEndingCreatingWorkBlocks  ? dateEndingCreatingWorkBlocks.toString() : undefined),
              windowStartTime: wednesdayStartTime,
              windowEndTime: wednesdayEndTime
            });
          }
          break;
        case 3: // thursday
          if (canWorkThursday){
            workBlocksToBeCreated.push({
              butlerId: createdButler.id,
              startDate: upcomingDate.toString(),
              endDate: (dateEndingCreatingWorkBlocks  ? dateEndingCreatingWorkBlocks.toString() : undefined),
              windowStartTime: thursdayStartTime,
              windowEndTime: thursdayEndTime
            });  
          }
          break;
        case 4: // friday
          if (canWorkFriday){
            workBlocksToBeCreated.push({
              butlerId: createdButler.id,
              startDate: upcomingDate.toString(),
              endDate: (dateEndingCreatingWorkBlocks  ? dateEndingCreatingWorkBlocks.toString() : undefined),
              windowStartTime: fridayStartTime,
              windowEndTime: fridayEndTime
            }); 
          }
          break;
        case 5: // saturday
          if (canWorkSaturday){
            workBlocksToBeCreated.push({
              butlerId: createdButler.id,
              startDate: upcomingDate.toString(),
              endDate: (dateEndingCreatingWorkBlocks  ? dateEndingCreatingWorkBlocks.toString() : undefined),
              windowStartTime: saturdayStartTime,
              windowEndTime: saturdayEndTime
            }); 
          }
          break;
        case 6: // sunday
          if (canWorkSunday){
            workBlocksToBeCreated.push({
              butlerId: createdButler.id,
              startDate: upcomingDate.toString(),
              endDate: (dateEndingCreatingWorkBlocks ? dateEndingCreatingWorkBlocks.toString() : undefined),
              windowStartTime: sundayStartTime,
              windowEndTime: sundayEndTime
            });     
          }
          break;
        default:
          break;
      }
    }
    // create work blocks 
    winston.info({event:'create-workBlocks', lastName}, {tags:'butler-signup'});
    createdWorkBlocks = await Promise.all(workBlocksToBeCreated.map(x=> {
      return this.app.service('workBlocks').create(x);
    }));
    winston.info({event:'create-workBlocks-success', lastName}, {tags:'butler-signup'});
    logsToSend += " - workblocks created";
    
    // butler bank details
    logsToSend += " - creating bank details";    
    winston.info({event:'create-bankDetails', lastName}, {tags:'butler-signup'});
    createdBankDetails = await this.app.service('butlerBankDetails').create({
      butlerId: createdButler.id,
      bankAccountName : bankAccountName,
      bankBsbNumber: bankBsbNumber,
      bankAccountNumber: bankAccountNumber
    });
    winston.info({event:'create-bankDetails-success', lastName}, {tags:'butler-signup'});
    logsToSend += " - bank details created";

    
           // Mark a butler lead as being "enrolled" onto the Backend platform (if they created a lead before going through with butler signup)

      try {
         // Get authorisation token
        logsToSend += " - updating lead on lead portal";
        const token = (await axios({
          method: 'POST',
          baseURL: `${getServerProtocol()}${process.env.FEATHERS_HOST_URL}`,
          url: '/authentication',
          data: {
            email: process.env.ROOT_EMAIL,
            password: process.env.ROOT_PASSWORD,
            strategy: 'operatorLocal'
          }
        }
        )).data.accessToken;
        console.log('updating butler lead');
        winston.info({event:'create-lead-on-portal', lastName}, {tags:'butler-signup'});
        const leadsToken = await authenticateAgainstLeadsPlatform(token.replace('Bearer ', ''));
        const mmutationResult = await axios({
          method: 'POST',
          url: process.env.LEADS_API,
          headers: { Authorization: 'Bearer ' + leadsToken},
          data: {
            query: `mutation {
              updateLead (
                butlerEnrolled: ENROLLED
                where: {
                  email: "${email}"
                }
              )
              {
                id
              }
            }` 
          }
        });
        winston.info({event:'create-lead-on-portal-success', lastName}, {tags:'butler-signup'});
        logsToSend += " - updated lead in lead portal";
      } catch(ex){
         winston.info({
          event:'create-lead-on-portal-error',
          error:ex.message,
          lastName
        }, {tags:'butler-signup'});

        sendEmail(this.app,{
          from: process.env.NO_REPLY_EMAIL_ADDRESS,
          to: process.env.NODE_ENV === 'development'
            ? 'test@getjarvis.com.au'
            : 'help@getjarvis.com.au',
          subject: 'Error converting butler lead into enrolled',
          html: ex.message
        });
        console.error(ex);
      }
    const emailToSend = {
      from: process.env.NO_REPLY_EMAIL_ADDRESS,
      to: createdButler.email,
      subject: 'Thank you for signing up',
      html: butlerSignedUpSuccessTemplate.replace('@butler_first_name@',createdButler.firstName).replace('@email@',createdButler.email),
    };
    sendEmail(this.app,emailToSend);



    logsToSend += " - finished signup successfullY!";

    const emailToSendForLogs = {
      from: process.env.NO_REPLY_EMAIL_ADDRESS,
      to: 'test@getjarvis.com.au',
      subject: 'Signup logs',
      html: logsToSend
    };
    sendEmail(this.app,emailToSendForLogs);
    

    return {result: 'Success'};
  } catch (ex){ // rollback all changes in case of exception, if we reached here it means the butler did not exist and was created in this method, hence delete
    logsToSend += " - butler creation failed!";

    winston.info({
      event:'butler-signup-failed',
      error:ex.message,
      lastName
    }, {tags:'butler-signup'});
    logger.info(`Rolling back butler creation with email: ${email}`)
    if (createdButler){
      if (createdButlerAddress){
        logger.info(`Rolling back address ${createdButlerAddress.id}`)
        await this.knex('butlerAddresses')
        .where('butlerId', createdButler.id)
        .del(); 
      }
      if (createdWorkBlocks){
        logger.info(`Rolling back work blocks ${createdWorkBlocks.length}`);
        await this.knex('workBlocks')
        .where('butlerId', createdButler.id)
        .del(); 
      }
      if (createdButlerSkills){
        logger.info(`Rolling back butler skills ${createdButlerSkills.length}`);
        await this.knex('butlerSkills')
        .where('butlerId', createdButler.id)
        .del(); 
      }
      if (createdBankDetails){
        logger.info(`Rolling back bank details ${createdBankDetails.id}`);
        await this.knex('butlerBankDetails')
        .where('butlerId', createdButler.id)
        .del(); 
      }
      await this.knex('butlers')
      .where('id', createdButler.id)
      .del(); 
    }

    logsToSend += ex.toString();

    const emailToSendForLogs2 = {
      from: process.env.NO_REPLY_EMAIL_ADDRESS,
      to: 'test@getjarvis.com.au',
      subject: 'Signup logs',
      html: logsToSend
    };
    sendEmail(this.app,emailToSendForLogs2);

    logger.error(ex.toString());
    throw ex;
  }
  }
  async find(params){
    let email= _.get(params,'query.email');
    let phoneNumber= _.get(params,'query.phoneNumber').replace(/^0+/, '');
    let butlerWithEmail = await this.app.service('butlers').find({query:{email:email}});
    let butlerWithPhoneNumber = await this.app.service('butlers').find(
      {query:{
        $or : [
          {phoneNumber : phoneNumber},
          {phoneNumber : '0'+phoneNumber},
          {phoneNumber : '+61'+phoneNumber},
          {phoneNumber : '+610'+phoneNumber},
          {phoneNumber : 'DNC '+phoneNumber},
          {phoneNumber : 'DNC'+phoneNumber},
          {phoneNumber : 'DNC0'+phoneNumber},
          {phoneNumber : 'DNC+61'+phoneNumber},
          {phoneNumber : 'DNC+610'+phoneNumber},
        ]
      }} 
      );

    let response = {email:(butlerWithEmail.length>0)?true:false, phoneNumber:(butlerWithPhoneNumber.length>0)?true:false};
    return response;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;


