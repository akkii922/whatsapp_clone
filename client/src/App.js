import logo from "./logo.svg";
import { useReducer, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import "./App.scss";
import ProfileSection from "./component/ProfileSection/ProfileSection";
import SearchPeople from "./component/SearchPeople/SearchPeople";
import ChatCardsListing from "./component/ChatCardsListing/ChatCardsListing";
import ChatSection from "./component/ChatSection/ChatSection";
import Login from "./component/Login/Login";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { BASE_URL, LOGIN, USER, USER_LIST } from "./utils/apiEndpoints";
import { postRequest, getRequest } from "./utils/apiRequests";
import AuthContext from "./context/AuthContext";
import SocketContext from "./context/SocketContext";
import io from "socket.io-client";
import friendsListReducer from "./reducer/friendsListReducer";

const initialState = {};

const socket = io.connect("http://localhost:2000", {
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionAttempts: 10,
});

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(["whatsappclone"]);
  const [error, setError] = useState(null);
  const [recentMsg, setRecentMsg] = useState({});
  const [recentOnlineFriend, setRecentOnlineFriend] = useState({});
  const [recentOfflineFriend, setRecentOfflineFriend] = useState({});
  const [userObj, setUserObj] = useState(() => {
    return cookies.user;
  });

  const [friendsList, friendsListDispatch] = useReducer(
    friendsListReducer,
    initialState
  );

  useEffect(() => {
    if (userObj && userObj.sessionId) {
      joinUser(userObj);
      getFriendsList(userObj);
    }
  }, []);

  const handleLogin = async (userData) => {
    const formData = new FormData();
    if (userData.file) {
      formData.append("profileImg", userData.file, userData.file.name);
    }
    formData.append("payload", JSON.stringify({ name: userData.name }));
    const response = await postRequest(`${BASE_URL}${LOGIN}`, formData);
    console.log(response);
    if (response.error) {
      setError(response.error);
      return false;
    }
    setCookie("user", response);
    setUserObj(response);
    joinUser(response);
    getFriendsList(response);
  };

  const handleLogout = () => {
    removeCookie("user");
    setUserObj(null);
  };

  const getFriendsList = async (userData) => {
    const response = await getRequest(
      `${BASE_URL}${USER_LIST}/${userData.sessionId}`
    );
    if (response.error) {
      setError(response.error);
      return false;
    }
    friendsListDispatch({ type: "FRIENDS", payload: response });
    onlineOfflineUser();
  };

  const onlineOfflineUser = () => {
    socket.on("new-online-user", (data) => {
      friendsListDispatch({ type: "NEW_FRIEND", payload: data });
      setRecentOnlineFriend(data);
    });
    socket.on("new-offline-user", (data) => {
      console.clear();
      console.log(data);
      setRecentOfflineFriend(data);
    });
  };

  const joinUser = (userData) => {
    let initData = {
      createdAt: userData.createdAt,
      name: userData.name,
      profileImg: userData.profileImg,
      sessionId: userData.sessionId,
      updatedAt: userData.updatedAt,
      _id: userData._id,
    };

    socket.emit("join-user", initData, (cbData) => {
      console.log("user joined");
    });

    socket.on("receive-msg", (data) => {
      console.log(data);
      updateRecentMsg(data);
      setRecentMsg(data);
    });

    socket.on("user-typing", (data) => {
      console.log(data);
      updateRecentMsg(data);
    });
  };

  const updateRecentMsg = (data) => {
    friendsListDispatch({ type: "RECENT_MSG", payload: data });
  };

  return (
    <>
      {!(userObj && userObj.sessionId) ? (
        <Login handleLogin={handleLogin} />
      ) : (
        <AuthContext.Provider value={userObj}>
          <SocketContext.Provider value={socket}>
            <div className="App">
              <Router>
                <div className="left-side">
                  <ProfileSection handleLogout={handleLogout} />
                  <SearchPeople />
                  <ChatCardsListing friendsList={friendsList} />
                </div>
                <Switch>
                  <Route path="/:id">
                    <div className="right-side">
                      <ChatSection
                        updateRecentMsg={updateRecentMsg}
                        recentMsg={recentMsg}
                        recentOnlineFriend={recentOnlineFriend}
                        recentOfflineFriend={recentOfflineFriend}
                      />
                    </div>
                  </Route>
                </Switch>
              </Router>
            </div>
          </SocketContext.Provider>
        </AuthContext.Provider>
      )}
    </>
  );
}

export default App;
