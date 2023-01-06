import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { registerUser } from "../../helper";

const Registration =() => {
    const [formData, setFormData] = useState({
        firstName : "",
        lastName : "",
        email : "",
        password : "",
        password2 : ""
    });

    const { firstName, lastName, email, password, password2 } = formData;
    const [error, setError] = useState("");
    const navigate=useNavigate();
    const onChange = (e) => {
        setFormData((prevState)=>({
            ...prevState,
            [e.target.name] : e.target.value,
        }))
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        if (firstName === "" || lastName === "" || email === "" || password === "" || password2 === "") {
            toast.error("Please fill all the fields");
            return;
        }
        else if (password !== password2) {
            toast.error("Passwords do not match");
            return;
        }
        try{
            const response = await registerUser({firstName, lastName, email, password});
            navigate("/auth/login");
        } catch(error) {
            toast.error(error);
        }  
    };


    return (
        <div className="regContainer">
            <div className="box">
                <form className="regForm">
                    <input
                        type="text"
                        className="regInput"
                        id="firstName"
                        name="firstName"
                        value={firstName}
                        placeholder="First Name"
                        onChange={onChange}
                    />
                    <input
                        type="text"
                        className="regInput"
                        id="lastName"
                        name="lastName"
                        value={lastName}
                        placeholder="Last Name"
                        onChange={onChange}
                    />
                    <input
                        type="email"
                        className="regInput"
                        id="email"
                        name="email"
                        value={email}
                        placeholder="Email"
                        onChange={onChange}
                    />
                    <input
                        type="password"
                        className="regInput"
                        id="password"
                        name="password"
                        value={password}
                        placeholder="**********"
                        onChange={onChange}
                    />
                    <input
                        type="password"
                        className="regInput"
                        id="password2"
                        name="password2"
                        value={password2}
                        placeholder="**********"
                        onChange={onChange}
                    />      
                    <button className="regButton" type="submit" onClick={handleSubmit}>Sign Up</button>
                    <div>
                        <h5 className="subtitleText">Already have an account ? &ensp;</h5>
                        <Link to="/auth/login" className="signinlink"><u>Sign in</u></Link>
                    </div>
                </form>
                
            </div>
        </div>
    );
}

export default Registration;