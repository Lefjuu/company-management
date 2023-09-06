const redis = require('redis');
const util = require('util');

const client = redis.createClient({
    url: `redis://127.0.0.1:6379`,
    legacyMode: true,
});

const setAsync = util.promisify(client.set).bind(client);
const getAsync = util.promisify(client.get).bind(client);

client.connect();
client.on('connect', () => {
    console.log('Redis client connected.');
});

client.on('error', (error) => {
    console.error('Redis Error:', error);
});

module.exports = {
    redisClient: client,
    setAsync,
    getAsync,
};
