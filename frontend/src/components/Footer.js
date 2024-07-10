import { Link } from "react-router-dom";
import { useState } from "react";

const Footer = () => {

    const [email, setEmail] = useState('');

    // Function to get the CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        fetch('/api/subscribe/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({ email }),
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) });
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    alert('There was an error subscribing: ' + data.error);
                } else {
                    alert('You have been subscribed successfully!');
                    setEmail('');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div className="footer-bar">
            <div className="logo">
                <h1>WordWise</h1>
                <div className="follow">
                    <h2>Follow Us</h2>
                    <div className="social-icons">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                            <img src="/static/images/img_rectangle21.png" alt="Facebook" />
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                            <img src="/static/images/img_rectangle22.png" alt="Instagram" />
                        </a>
                        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                            <img src="/static/images/img_rectangle23.png" alt="Twitter" />
                        </a>
                        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                            <img src="/static/images/img_rectangle24.png" alt="YouTube" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="quick-link">
                <h2>Quick Links</h2>
                <div className="bottom-nav">
                    <Link to="/" className="nav-item">Home</Link>
                    <Link to="/quiz" className="nav-item">Quiz</Link>
                    <Link to="/support" className="nav-item">Support</Link>
                    <Link to="/privacy" className="nav-item">Privacy Policy</Link>
                    <Link to="/about" className="nav-item">About Us</Link>
                </div>
            </div>
            <div className="subscribe">
                <h2>Let's Connect !</h2>
                <p>Join our community for free</p>
                <form className="subscribe-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <button style={{marginTop: '2vh'}} type="submit">Subscribe</button>
                </form>
            </div>
        </div>
    );
}

export default Footer;