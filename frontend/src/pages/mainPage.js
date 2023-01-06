import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import MainImage from "../public/Group video-amico.svg";
import "./mainPage.css";

const Home = () => {

    return (
        <div className="mainDiv">
            <Helmet>
                <style>{'body { background-color: #191919; }'}</style>
            </Helmet>
            <head>
                <title>Treffen</title>
                <meta name="description" content="Created by Ali"></meta>
            </head>
            <div className="pageBody">
                <nav className="navbarMain">
                    <h1 className="websiteLogo">
                        Treffen
                    </h1>
                    <ul className="navbarList">
                        <li>
                            <a className="navbarLink1" href="#">
                                Home
                            </a>
                        </li>
                        <li>
                            <a className="navbarLink" href="#">
                                Features
                            </a>
                        </li>
                        <li>
                            <a className="navbarLink" href="#">
                                About Us
                            </a>
                        </li>
                        <li>
                            <a className="navbarLink" href="#">
                                Contact
                            </a>
                        </li>
                    </ul>
                    <div className="loginButtonDiv">
                        <Link className="mainLink" to="/auth/login">
                            <button type="button" className="loginButton">
                                Login
                            </button>
                        </Link>
                    </div>
                </nav>
                <div className="heading">
                    <h1 className="titleText">Feeling left out from rest of the world</h1>
                    <h1 className="titleText">Not Anymore!</h1>
                    <h1 className="titleSub">Connect and grow beyond your limitations</h1>
                    <img src={MainImage} alt="MainImage" className="mainImage" />
                </div>
            </div>
        </div>
    )
};

export default Home;