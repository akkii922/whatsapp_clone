import { useContext } from 'react';
import './ProfileSection.scss'
import AuthContext from './../../context/AuthContext';

const ProfileSection = ({handleLogout}) => {
    const userObj = useContext(AuthContext);
    const { profileImg, name } = userObj;
    return (
        <div className="profile-section">
            <div className="img-container">
                <img alt="image" src={profileImg} />
            </div>
            {name}
            <div className="action-items" onClick={handleLogout}>
                Logout
            </div>
        </div>
    )
}

export default ProfileSection;