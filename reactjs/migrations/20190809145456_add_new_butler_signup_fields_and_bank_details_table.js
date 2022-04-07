exports.up = async function(knex, Promise) {
  await knex.schema.table('butlers', function (table) {
    table.datetime('dateTimeCreated');
    table.string('canDoOtherTaskThanPredefined',1000);
    table.boolean('cleaningExperienceAtAnotherHomeCleaningCompany').defaultTo(false);
    table.boolean('cleaningExperienceAtCommercialCleaningCompany').defaultTo(false);
    table.boolean('cleaningExperienceAtHotel').defaultTo(false);
    table.boolean('cleaningExperienceAtOneOrMorePrivateProperties').defaultTo(false);
    table.string('howWouldTheButlerTidyARoom',1000);
    table.string('tellUsAboutYourselfNotes',1000);
    table.string('curriculumUrl',1000);
    table.string('curriculumPlainText',1000);
    table.string('butlerRefereePhoneNumber');
    table.boolean('passedIeltsExam').defaultTo(false);
    table.decimal('ieltsExamScore').defaultTo(0.0);
    table.boolean('passedPteExam').defaultTo(false);
    table.integer('pteExamScore').defaultTo(10);
    table.boolean('hasWorkingRightsInAustralia').defaultTo(false);
    table.string('expectedLivingInAustraliaPeriod');
    table.boolean('hasPoliceCheckOrWillGetOneWhenStartingWithUs').defaultTo(false);
    table.boolean('nativeEnglishSpeaker').defaultTo(false);
    table.string('abnNumber');
    table.boolean('canCommitToWorkSameDaysEachWeek').defaultTo(false);
    table.string('whereDidButlerHearAboutUs');


    table.boolean('isStayAtHomeMum').defaultTo(false);
    table.boolean('isInternationalStudent').defaultTo(false);
    table.boolean('isHolidayWorker').defaultTo(false);
    table.boolean('isCareerCleanerOrHousekeeper').defaultTo(false);    
    

    table.string('workingHoursPerWeekIdeally');
    table.string('howLongWouldButlerWorkWithUs');
    table.string('reasonsButlerMayLeaveInComingMonths');
    table.string('previosulyWorkedOnCleaningPlatforms');
    table.boolean('answersGivenThruthfully').defaultTo(false);
    table.boolean('hasPublicLiabilityInsurance').defaultTo(false);
    table.boolean('verified').defaultTo(false);

    //fields needed for email verification and password reset
    table.boolean('isVerified').defaultTo(false);
    table.string('verifyToken');
    table.date('verifyExpires');
    table.json('verifyChanges');
    table.string('resetToken');
    table.date('resetExpires');
  });

 


  await knex.schema.createTableIfNotExists('butlerBankDetails', table => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1mc()'));
    table.uuid('butlerId').notNullable();
    table.unique('butlerId');
    table.foreign('butlerId').references('butlers.id');
    table.string('bankAccountName');
    table.string('bankBsbNumber');
    table.string('bankAccountNumber');
  });

  await knex.raw(`ALTER TABLE public."butlers" DROP CONSTRAINT check_butlers_cleaning_exp,
    add constraint check_butlers_cleaning_exp 
    check ("cleaningExp" BETWEEN 0 AND 5);
  `);

  await knex('butlers').update( 'verified', true);

};

exports.down = async function(knex, Promise) {
  await knex.schema.table('butlers', function (table) {
    table.dropColumn('dateTimeCreated');
    table.dropColumn('canDoOtherTaskThanPredefined');
    table.dropColumn('cleaningExperienceAtAnotherHomeCleaningCompany');
    table.dropColumn('cleaningExperienceAtCommercialCleaningCompany');
    table.dropColumn('cleaningExperienceAtHotel');
    table.dropColumn('cleaningExperienceAtOneOrMorePrivateProperties');
    table.dropColumn('howWouldTheButlerTidyARoom');
    table.dropColumn('curriculumPlainText');
    table.dropColumn('tellUsAboutYourselfNotes');
    table.dropColumn('curriculumUrl');
    table.dropColumn('butlerRefereePhoneNumber');
    table.dropColumn('passedIeltsExam');
    table.dropColumn('ieltsExamScore');
    table.dropColumn('passedPteExam');
    table.dropColumn('pteExamScore');


    table.dropColumn('isStayAtHomeMum');
    table.dropColumn('isInternationalStudent');
    table.dropColumn('isHolidayWorker');
    table.dropColumn('isCareerCleanerOrHousekeeper');

    table.dropColumn('hasWorkingRightsInAustralia');
    table.dropColumn('nativeEnglishSpeaker');
    table.dropColumn('expectedLivingInAustraliaPeriod');
    table.dropColumn('hasPoliceCheckOrWillGetOneWhenStartingWithUs');
    table.dropColumn('abnNumber');
    table.dropColumn('canCommitToWorkSameDaysEachWeek');
    table.dropColumn('whereDidButlerHearAboutUs');
    table.dropColumn('workingHoursPerWeekIdeally');
    table.dropColumn('howLongWouldButlerWorkWithUs');
    table.dropColumn('reasonsButlerMayLeaveInComingMonths');
    table.dropColumn('previosulyWorkedOnCleaningPlatforms');
    table.dropColumn('answersGivenThruthfully');
    table.dropColumn('hasPublicLiabilityInsurance');
    table.dropColumn('verified');

    //fields needed for email verification
    table.dropColumn('isVerified');
    table.dropColumn('verifyToken');
    table.dropColumn('verifyExpires');
    table.dropColumn('verifyChanges');
    table.dropColumn('resetToken');
    table.dropColumn('resetExpires');
  
  });
  await knex.schema.dropTableIfExists('butlerBankDetails');

};