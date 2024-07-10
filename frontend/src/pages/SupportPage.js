import React, { useState } from 'react';
import NavBar from "../components/NavBar";

const SupportPage = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');


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

        fetch('/api/support/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({ name, email, message }),
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) });
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    alert('There was an error sending your message: ' + data.error);
                } else {
                    alert('Your message has been sent successfully!');
                    window.location.reload();  // Refresh the page
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };


    return (
        <div className='form-page'>
            <NavBar logoHide={false} />
            <div className='form-card'>
                <h2 style={{ fontSize: "5vh", textDecoration: "underline", marginBottom: "3vh", marginTop: "5vh", color: "#FF5F6D" }}>Support Form</h2>
                <form className='form' onSubmit={handleSubmit}>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" required onChange={e => setName(e.target.value)} />

                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required onChange={e => setEmail(e.target.value)} />

                    <label htmlFor="message">Message:</label>
                    <textarea id="message" name="message" required onChange={e => setMessage(e.target.value)}></textarea>

                    <div style={{ display: 'flex', justifyContent: 'center', margin: "2vh 0 5vh 0" }}>
                        <input type="submit" value="Submit" style={{ color: "white", width: "fit-content", backgroundColor: "#FF5F6D", fontSize: "4vh", padding: "1.2vh 5vh 1.2vh 5vh", border: "none", borderRadius: "1.5vh", cursor: "pointer" }} />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SupportPage;