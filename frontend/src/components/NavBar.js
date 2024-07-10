import React, { useState, useEffect } from "react";
import {Link } from "react-router-dom";

const NavBar = (props) => {
    const [menu, setMenu] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);

    const toggle = () => {
        setMenu(!menu);
    }

    useEffect(() => {
        const changeWidth = () => {
          setWidth(window.innerWidth);
        }
        window.addEventListener('resize', changeWidth);
        return () => {
          window.removeEventListener('resize', changeWidth);
        }
      }, []);

    return (
        <div className="nav">
            {!props.logoHide ? <h1>WordWise</h1> : null}
            <div className='menu'>
                { (width <= 600) && <button onClick={toggle} >{!props.logoHide ? <img src="/static/images/menu_p.png" style={{width:"8vw", margin:"1vw"}}/> : <img src="/static/images/menu_w.png" style={{width:"8vw", margin:"1vw"}}/>}</button>}
            </div>
            {(menu || width > 600) && (
                <nav className='top-nav'>
                    <Link to="/" className="nav-item">Home</Link>
                    <Link to="/quiz" className="nav-item">Quiz</Link>
                    <Link to="/support" className="nav-item">Support</Link>
                    <Link to="/privacy" className="nav-item">Privacy Policy</Link>
                    <Link to="/about" className="nav-item">About Us</Link>
                </nav>
            )}
        </div>
    );
}

export default NavBar;
