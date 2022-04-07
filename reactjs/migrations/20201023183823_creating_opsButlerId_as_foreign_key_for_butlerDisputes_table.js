
exports.up = async function (knex, Promise) {
    return await knex.schema.table('butlerDisputes', function (table) {
        table.foreign('opsButlerId').references('butlers.id');
    });
};

exports.down = async function (knex, Promise) {
    return await knex.schema.table('butlerDisputes', function (table) {
        table.dropForeign('opsButlerId');
    });
};
