var Knex = require('knex');

module.exports = function (opts) {
  return function *knex(next) {
    var conn = opts.connection || { };
    var env = process.env;
    global.__knex || (global.__knex = Knex({
      client: opts.client,
      debug: opts.debug || env.KOA_KNEX_DEBUG,
      connection: {
        host: conn.host || env.KOA_KNEX_HOST,
        port: conn.port || env.KOA_KNEX_PORT,
        user: conn.user || env.KOA_KNEX_USER,
        password: conn.password || env.KOA_KNEX_PASSWORD,
        database: conn.database || env.KOA_KNEX_DATABASE,
        charset: conn.charset || env.KOA_KNEX_CHARSET,
        ssl: conn.ssl || env.KOA_KNEX_SSL,

        /** For SQLite 3: http://knexjs.org/#Initialize */
        filename: conn.filename || env.KOA_KNEX_FILENAME
      }
    }));
    this.knex = global.__knex;

    if(opts.debug || env.KOA_KNEX_DEBUG) {
      var self = this;
      this.knex.once('start', function (builder){
        var start = Date.now();
        builder.once('end', function (){
          var timing = Date.now() - start;
          console.log(timing + 'msec');
        });
      });
    }

    yield next;
  };
};
