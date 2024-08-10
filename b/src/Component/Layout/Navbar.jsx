import { useContext, useState, useEffect } from 'react';
import { Context } from '../../index.js'; // Adjust the import path as needed
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Navbar = () => {
    const [show, setShow] = useState(false);
    const { isAuthorized, setIsAuthorized, setUser, user } = useContext(Context);
    const navigateTo = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/user", { withCredentials: true });
                setUser(response.data.user);
                setIsAuthorized(true);
            } catch (error) {
                console.error('Fetch User Error:', error);
                setUser(null); // Ensure user is set to null or undefined if there's an error
                setIsAuthorized(false);
            }
        };

        fetchUserData();
    }, [setUser, setIsAuthorized]);
    const handleLogout = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/v1/reg/logout", { withCredentials: true });
            console.log('Logout Response:', response);
    
            // Clear local storage
            localStorage.removeItem("user"); // Clear only the specific item if needed
    
            // Show success message
            toast.success(response.data.message || "Logout successful");
    
            // Update context and redirect
            setIsAuthorized(false);
            setUser(null); // Ensure user is cleared from the context
            navigateTo("/login");
        } catch (error) {
            console.error('Logout Error:', error.response ? error.response.data : error.message); // More detailed error info
            const errorMessage = error.response?.data?.message || "An error occurred during logout.";
            toast.error(errorMessage);
        }
    };
    

    return (
        <nav className={isAuthorized ? "navbarShow" : "navbarHide"}>
            <div className="container">
                <div className="logo">
                    <img src="" alt="Logo" />
                </div>
                <ul className={!show ? "menu" : "show-menu menu"}>
                    <li>
                        <Link to="/" onClick={() => setShow(false)}>Home</Link>
                    </li>
                    <li>
                        <Link to="/job/getall" onClick={() => setShow(false)}>All Job</Link>
                    </li>
                    <li>
                        <Link to="/application/me" onClick={() => setShow(false)}>
                            {user?.role === "Employer" ? "My Application" : "Applicant Application"}
                        </Link>
                    </li>
                    {user?.role === "Employer" && (
                        <>
                            <li>
                                <Link to="/job/post" onClick={() => setShow(false)}>Post New Job</Link>
                            </li>
                            <li>
                                <Link to="/job/me" onClick={() => setShow(false)}>View Your Jobs</Link>
                            </li>
                        </>
                    )}
                    <li>
                        <button onClick={handleLogout}>Logout</button>
                    </li>
                </ul>
                <div className='hamburger'>
                    {/* <GiHamburgerMenu onClick={() => setShow(!show)} /> */}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
