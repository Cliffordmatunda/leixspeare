import react from 'react';
import { useNavigate } from "react-router-dom";


export const Navbar = () => {
    const navigate = useNavigate();
    return(
        <nav className='Navbar'>
            <h1>LEIXSPEARE</h1>
            <ul className='navbar-links'>
                <li><a href ="#home" onClick={() => navigate("/")}>Home</a></li>
                <li><a href ="#pricing" onClick={() => navigate("/pricing")}>Pricing</a></li>
                <li><a href ="#about" onClick={() => navigate("/about")}>About us</a></li>
                <li><a href ="#contact" onClick={() => navigate("/contact")}>Contact</a></li>
                </ul>
                <div className="navbar-auth">
                    <button className='login'>Login</button>
                    <button className='signup'>Sign Up</button>
                    </div>


        </nav>
    );
};
export default Navbar;