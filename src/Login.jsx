import { useState } from "react";
import "./Login.css";
import "./App.css";


function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Logging in with:", username, password);
    };

    return (
        <div className="login-container">
            <p>An engagement tracker app for students at PFW</p>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Log in</button>
            </form>

            <p className="forgot-password">Forgot your password?</p>

            <div className="line-divider">
                <span className="span-line-divider">or continue with</span>
            </div>


            <button className="google-login">Log in with Google</button>
            <button className="facebook-login">Log in with Facebook</button>

        </div>
    );
}

export default Login;
