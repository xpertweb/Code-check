
exports.up = function(knex, Promise) {
  return knex.schema.raw(`
  -- Slightly modified from http://justatheory.com/computers/databases/postgresql/recurring_events.html
  CREATE OR REPLACE FUNCTION generate_recurrences(
    recurs TEXT,
    start_date DATE,
    end_date DATE
  )
    RETURNS setof DATE
    LANGUAGE plpgsql IMMUTABLE
    AS $BODY$
  DECLARE
    next_date DATE := start_date;
    duration  INTERVAL;
    day       INTERVAL;
    check     TEXT;
  BEGIN
    IF recurs = 'n' THEN
      RETURN next next_date;
    ELSIF recurs = 'w' THEN
      duration := '7 days'::interval;
      WHILE next_date < end_date LOOP
        RETURN NEXT next_date;
        next_date := next_date + duration;
      END LOOP;
    ELSIF recurs = 'f' THEN
      duration := '14 days'::interval;
      WHILE next_date < end_date LOOP
        RETURN NEXT next_date;
        next_date := next_date + duration;
      END LOOP;
    ELSE
      RAISE EXCEPTION 'Recurrence % not supported by generate_recurrences()', recurs;
    END IF;
  END;
  $BODY$;
  `);
};

exports.down = function(knex, Promise) {
  return knex.schema.raw('DROP FUNCTION IF EXISTS generate_recurrences(TEXT, DATE, DATE);');
};
