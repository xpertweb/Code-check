
exports.up = async function (knex, Promise) {
    return await knex.schema.table('butlerVisitCheckinStatus', function (t) {
        t.boolean('butlerPreviouslyVisitedClient').defaultTo(false);
        t.boolean('butlerRescheduledWithClient').defaultTo(false);
        t.date('butlerRescheduledDate');
        t.boolean('butlerWillVisitClientInTheFuture').defaultTo(false);
        t.date('butlerNextAvailabilityDate')
        t.boolean('butlerAvailableThisWeek')
    });
};

exports.down = async function (knex, Promise) {
    return await knex.schema.table('butlerVisitCheckinStatus', function (t) {
        t.dropColumn('butlerPreviouslyVisitedClient');
        t.dropColumn('butlerRescheduledWithClient');
        t.dropColumn('butlerRescheduledDate');
        t.dropColumn('butlerWillVisitClientInTheFuture');
        t.dropColumn('butlerNextAvailabilityDate')
        t.dropColumn('butlerAvailableThisWeek')
    });
};
