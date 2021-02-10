const redisClient = require("./../config/redis");

exports.addUsersToListRedis = (key, subKey, value, cb) => {
  redisClient.HMSET(key, subKey, JSON.stringify(value), (err, res) => {
    return cb(err, res);
  });
};

exports.removeUsersFromListRedis = (key, subKey) => {
  redisClient.HDEL(key, subKey);
};

exports.getOfflineUserInfo = (key, subKey, cb) => {
  redisClient.HGET(key, subKey, (err, res) => {
    cb(err, res);
  });
};
