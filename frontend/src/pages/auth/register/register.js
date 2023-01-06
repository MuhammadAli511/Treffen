import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Registeration from "../../../components/Register";


const Register = () => {  

    return ( 
        <div className="mainDiv">
            <Helmet>
                <style>{'body { background-color: #191919; }'}</style>
            </Helmet>
            <ToastContainer
                position='top-center'
            />
            <head>
                <title>Treffen</title>
                <meta name="description" content="Created by Ali"></meta>
            </head>
            <div className="pageBody">
                <nav className="navbarMain">
                    <h1 className="websiteLogo">
                        <Link to="/" className="mainLink">Treffen</Link>
                    </h1>
                </nav>
            
                <div className="signupTitle">
                    <h1 className="titleText" >Sign Up</h1>
                </div>
                <Registeration/>
            </div>
        </div>
    );
}
export default Register;