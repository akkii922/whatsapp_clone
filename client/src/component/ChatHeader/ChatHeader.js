import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faUser } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from './../../utils/helper';

import './ChatHeader.scss';

const ChatHeader = ( {friendInfo} ) => {
  const { isOnline, profileImg, name, updatedAt } = friendInfo;
  return (
    <div className="chat-header">
      <div className="img-container">
        {profileImg ? (
          <img
          alt="image"
          src={profileImg}
        />
        ) :
        <FontAwesomeIcon className="icon-block" icon={faUser} /> }
      </div>
      <div className="card-detail">
          <h4 className="title">{name ? name : ""}</h4>
          <p className="desc">
            {isOnline ? "Online" 
            : `Last seen ${updatedAt ? formatDate(updatedAt) : ""}`}
          </p>
      </div>
      <div className="acion-items">
          <FontAwesomeIcon icon={faEllipsisV} />
      </div>
    </div>
  );
};

export default ChatHeader;
