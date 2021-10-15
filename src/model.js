const Redis = require("redis");
const client = Redis.createClient();
const util = require("util");

module.exports = {
    hmset: util.promisify(client.hmset).bind(client),
    keys: util.promisify(client.keys).bind(client),
    hgetall: util.promisify(client.hgetall).bind(client),
    del: util.promisify(client.del).bind(client)
}