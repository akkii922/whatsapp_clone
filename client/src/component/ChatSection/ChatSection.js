import { useState, useContext, useReducer, useEffect } from "react";
import ChatHeader from "./../ChatHeader/ChatHeader";
import Chat from "./../Chat/Chat";
import AuthContext from "./../../context/AuthContext";
import SocketContext from "./../../context/SocketContext";
import ChatForm from "./../ChatForm/ChatForm";
import chatsReducer from "./../../reducer/chatsReducer";
import { useParams } from "react-router-dom";
import { postRequest, getRequest } from "./../../utils/apiRequests";
import {
  BASE_URL,
  CHATS,
  USER,
  CHECK_IS_OFFLINE,
} from "./../../utils/apiEndpoints";

const initialChatsState = [];

const ChatSection = ({
  updateRecentMsg,
  recentMsg,
  recentOnlineFriend,
  recentOfflineFriend,
}) => {
  const userObj = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const [error, setError] = useState({});
  const [friendInfo, setFriendInfo] = useState({});
  const [isChatLoading, setChatLoading] = useState(false);
  const [chats, chatsDispatch] = useReducer(chatsReducer, initialChatsState);
  const params = useParams();
  const paramId = params.id;

  useEffect(() => {
    getFriendInfo();
    getChats();
    return () => {
      chatsDispatch({ type: "RESET_CHATS", payload: [] });
    };
  }, [paramId]);

  useEffect(() => {
    if (isChatLoading && recentMsg && paramId === recentMsg.senderId) {
      chatsDispatch({ type: "CHATS", payload: [recentMsg] });
    }
  }, [recentMsg.time]);

  useEffect(() => {
    if (paramId === recentOnlineFriend.sessionId) {
      setFriendInfo({ ...friendInfo, isOnline: true });
    }
  }, [recentOnlineFriend]);

  useEffect(() => {
    if (paramId === recentOfflineFriend.sessionId) {
      setFriendInfo({
        ...friendInfo,
        isOnline: false,
        updatedAt: recentOfflineFriend.time,
      });
    }
  }, [recentOfflineFriend]);

  const sendMsg = (value, type, theme) => {
    socket.emit(
      "send-msg",
      {
        senderId: userObj.sessionId,
        receiverId: paramId,
        msg: value,
        type,
        theme,
      },
      (cbData) => {
        updateRecentMsg(cbData);
        chatsDispatch({ type: "CHATS", payload: [cbData] });
      }
    );
  };

  const sendTyping = (value) => {
    socket.emit(
      "user-typing",
      {
        senderId: userObj.sessionId,
        receiverId: paramId,
        msg: value,
      },
      (cbData) => {
        // console.log("typing")
      }
    );
  };

  const getFriendInfo = async () => {
    const response = await getRequest(`${BASE_URL}${USER}/${paramId}`);
    if (response.error) {
      setError(response.error);
      return false;
    }
    const userOfflineRes = await checkIfUserOffline(response);
    let userAvailability = {
      isOnline: true,
    };
    if (userOfflineRes) {
      userAvailability.isOnline = false;
      userAvailability["updatedAt"] = userOfflineRes.time;
    }
    setFriendInfo({ ...response, ...userAvailability });
  };

  const getChats = async () => {
    const response = await postRequest(`${BASE_URL}${CHATS}`, {
      senderId: userObj.sessionId,
      receiverId: paramId,
    });
    if (response.error) {
      setError(response.error);
      return false;
    }
    chatsDispatch({ type: "CHATS", payload: response });
    setChatLoading(true);
  };

  const checkIfUserOffline = async () => {
    const response = await getRequest(
      `${BASE_URL}${CHECK_IS_OFFLINE}/${paramId}`
    );
    if (response.error) {
      setError(response.error);
      return false;
    }
    return response;
  };

  return (
    <>
      <ChatHeader friendInfo={friendInfo} />
      <Chat
        sessionId={paramId}
        friendName={friendInfo && friendInfo.name}
        chats={chats}
      />
      <ChatForm sendMsg={sendMsg} sendTyping={sendTyping} />
    </>
  );
};

export default ChatSection;
