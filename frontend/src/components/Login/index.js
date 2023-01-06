import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginUser } from "../../helper";

const Login =() => {

    const [formData, setFormData] = useState({
        email : "",
        password : "",
    });
    const navigate = useNavigate();

    const { email, password } = formData;


    const onChange = (e) => {
        setFormData((prevState)=>({
            ...prevState,
            [e.target.name] : e.target.value,
        }))
    }
    const handleSubmit = async(e) => {
        e.preventDefault();
        if (email === "" || password === "") {
            toast.error("Please fill all the fields");
            return;
        }
        try{
            const response = await loginUser({email, password});
            console.log(response);
            if (response.error) {
                toast.error(response.error);
                return;
            }
            navigate("/treffen");
            
            

        } catch(error) {
            console.log(error);
            toast.error(error);
        }
    };

   
    return (
        <div className="regContainer">
            
            <div className="box">
                <form className="regForm">
                    <input
                        type="email"
                        className="regInput"
                        id="email"
                        name="email"
                        placeholder="Email"
                        onChange={onChange}
                    />
                    <input
                        type="password"
                        className="regInput"
                        id="password"
                        name="password"
                        placeholder="Password"
                        onChange={onChange}
                    />
                    <button className="regButton" type="submit" onClick={handleSubmit}>Sign In</button>
                    <div>
                        <h5 className="subtitleText">Don't have an account ? &ensp;</h5>
                        <Link to="/auth/register" className="signinlink"><u>Create One</u></Link>
                    </div>
                </form>
                
            </div>
        </div>
    );
}

export default Login;