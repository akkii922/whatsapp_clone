const io = require("./../../server").io;
const {
  addUsersToListRedis,
  removeUsersFromListRedis,
} = require("./../models/heartbeat.model");
const { saveChats } = require("./../models/common.model");
const { getTime } = require("./../helper");

module.exports = (socket) => {
  try {
    console.log("Connected");
    socket.on("join-user", (data, callback) => {
      const { createdAt, name, profileImg, sessionId, updatedAt, _id } = data;
      const currentTime = getTime();
      const newUser = {
        createdAt,
        name,
        profileImg,
        sessionId,
        updatedAt: currentTime,
        _id,
      };
      // WC:user:OFF (delete the user from here)
      removeUsersFromListRedis(`WC:user:OFF`, sessionId);
      // WC:user:ON (add user here)
      addUsersToListRedis(
        `WC:user:ON`,
        sessionId,
        { time: currentTime },
        (e, r) => {
          if (e) return callback(e);
          console.log("new user joined", r);
          socket.sessionId = sessionId;
          socket.join(sessionId);
          socket.broadcast.emit("new-online-user", newUser);
          callback();
        }
      );
    });

    socket.on("send-msg", async (data, callback) => {
      const { senderId, receiverId, msg } = data;
      const chatObj = {
        room: [receiverId, senderId],
        senderId,
        receiverId,
        msg,
        time: getTime(),
      };
      await saveChats(chatObj);
      io.to(receiverId).emit("receive-msg", chatObj);
      callback(chatObj);
    });

    socket.on("user-typing", async (data, callback) => {
      const { senderId, receiverId, msg } = data;
      const chatObj = {
        room: [receiverId, senderId],
        senderId,
        receiverId,
        msg,
        time: getTime(),
      };
      io.to(receiverId).emit("user-typing", chatObj);
      callback(data);
    });

    socket.on("disconnect", () => {
      const { sessionId } = socket;
      if (sessionId) {
        removeUsersFromListRedis(`WC:user:ON`, sessionId);
        const offlineUser = {
          time: getTime(),
          sessionId,
        };
        addUsersToListRedis(`WC:user:OFF`, sessionId, offlineUser, (e, r) => {
          console.log("user left", r);
        });
        socket.broadcast.emit("new-offline-user", offlineUser);
      }
    });
  } catch (ex) {
    console.log(ex.message);
  }
};
