import { useState } from 'react';
import './CSS/Loginsignup.css';

const LoginSignup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    adminSite: true
                }),
            });
            const data = await response.json();
            if (data.success) {
                const token = data.token;
                localStorage.setItem('auth-token', token);
                window.location.replace("/");
            } else {
                alert(data.errors);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        }
    };

    return (
        <div className="loginsignup">
            <div className="loginsignup-container">
                <h1>Admin Login</h1>
                <div className="loginsignup-fields">
                    <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
};

export default LoginSignup;
