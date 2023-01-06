import { Helmet } from 'react-helmet';
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "../../../components/Login";

const Signin = () => {

    return (
        <div className="pageBody">
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
            <section className="sectionOne">
                <nav className="navbarMain">
                    <h1 className="websiteLogo">
                        <Link className="mainLink" to="/">Treffen</Link>
                    </h1>
                </nav>
                <div className="signinTitle">
                    <h1 className="signtitleText">Sign In</h1>
                </div>
                <Login />
            </section>
        </div>
    );
}

export default Signin;
