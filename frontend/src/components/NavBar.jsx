import React, { useContext } from 'react'
import styles from '../pages/css/home.module.css'
import UserContext from './UserContext'
import { useNavigate } from 'react-router-dom'


const NavBar = () => {
    const {user, login, logout} = useContext(UserContext);

    const navigate = useNavigate();

    const handleDashboardClick = () => {
        navigate('/dashboard');
    }

    const handleLogoutClick = () => {
        logout();
        navigate('/login');
    }

    return (
        <header className={styles.header}>
            <div className={styles.logo}>SLip</div>
            <div className={styles.username}>{user ?.username}'s Slips</div>
            <div className={styles.nav}>
            {/*<button onClick={handleDashboardClick}>Dashboard</button>*/}
            <button onClick={handleLogoutClick}>Logout</button>
            </div>
        </header>
    )
}

export default NavBar