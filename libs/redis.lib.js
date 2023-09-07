const redis = require('redis');
const util = require('util');
const { REDIS_HOSTNAME, REDIS_PORT } = require('../config');

console.log(`${REDIS_HOSTNAME}:${REDIS_PORT}`);
const client = redis.createClient({
    url: `${REDIS_HOSTNAME}:${REDIS_PORT}`,

    legacyMode: true,
});

const setAsync = util.promisify(client.set).bind(client);
const getAsync = util.promisify(client.get).bind(client);

client.on('connect', () => {
    console.log('✔️  Redis client connected.');
});

client.on('error', (error) => {
    console.error('Redis Error:', error);
});

module.exports = {
    redisClient: client,
    setAsync,
    getAsync,
};
