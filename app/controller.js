const { getUniqueId, getTime } = require("./helper");
const {
  userLogin,
  getUsersList,
  getUserInfo,
  getUserChats,
} = require("./models/common.model");

const { getOfflineUserInfo } = require('./models/heartbeat.model');

exports.userLogin = async (req, res) => {
  try {
    const { name } = JSON.parse(req.body.payload);
    const currentTime = getTime();
    let user = {
      name,
      profileImg: "",
      sessionId: getUniqueId(),
      createdAt: currentTime,
      updatedAt: currentTime,
    };
    if (req.file && req.file.filename) {
      user[
        "profileImg"
      ] = `${process.env.BASE_PATH}:${process.env.PORT}/${process.env.PROFILE_IMAGE_PATH}/${req.file.filename}`;
    }

    // store this user in mongo
    let id = await userLogin(user);
    user["_id"] = id;
    res.status(200).send(user);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
};

exports.getUsersList = async (req, res) => {
  try {
    const userList = await getUsersList(req.params.id);
    let userListObj = {};
    if (userList.length) {
      for (let i = 0; i < userList.length; i++) {
        userListObj[userList[i].sessionId] = userList[i];
      }
    }
    res.status(200).send(userListObj);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const userInfo = await getUserInfo(req.params.id);
    res.status(200).send(userInfo);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
};

exports.getUserChats = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const chats = await getUserChats(senderId, receiverId);
    res.status(200).send(chats);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
};

exports.uploadVoice = async (req, res) => {
  try {
    let filePath = "";
    if (req.file.filename) {
      filePath = `${process.env.BASE_PATH}:${process.env.PORT}/${process.env.AUDIO_PATH}/${req.file.filename}`;
    }
    res.status(200).send(filePath);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
};

exports.uploadImageFile = async (req, res) => {
  try {
    let filePath = "";
    if (req.file.filename) {
      filePath = `${process.env.BASE_PATH}:${process.env.PORT}/${process.env.IMAGE_MSG_PATH}/${req.file.filename}`;
    }
    res.status(200).send(filePath);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
};

exports.checkIfUserOffline = (req, res) => {
  try {
    getOfflineUserInfo("WC:user:OFF", req.params.id, (e, r) => {
      if (e) {
        throw new Error("Some error occured");
      }
      res.status(200).send(r ? r : false);
    });
  } catch (ex) {
    res.status(400).send(ex.message);
  }
};
