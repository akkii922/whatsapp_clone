import "./Chat.scss";
import ScrollToBottom from "react-scroll-to-bottom";
import { shortFormatTime } from "../../utils/helper";

const Chat = ({ sessionId, friendName, chats }) => {
  const renderMsg = (msg) => {
    if (msg.type === "file") {
      if (msg.theme === "audio") {
        return <audio src={msg.value} controls />;
      } else if (msg.theme === "image") {
        return <img style={{ width: "100px" }} src={msg.value} />;
      }
    }
    return msg.value;
  };
  return (
    <ScrollToBottom className="chat-section">
      {chats.map((chat) => (
        <div
          key={chat._id}
          className={`chat ${sessionId === chat.senderId ? "you" : "me"}`}
        >
          {sessionId === chat.senderId ? (
            <span className="name">{friendName}</span>
          ) : null}
          <p className="msg">{renderMsg(chat.msg)}</p>
          <span className="time">{shortFormatTime(chat.time)}</span>
        </div>
      ))}
    </ScrollToBottom>
  );
};

export default Chat;
