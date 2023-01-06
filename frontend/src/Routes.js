import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/login/login";
import Register from "./pages/auth/register/register";
import MainPage from "./pages/main/Main";
import Home from "./pages/mainPage";
import Meeting from "./pages/meeting/call/[cid]";

const Routing = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/treffen" element={<MainPage />} />
                <Route path="/meeting/call/:cid" element={<Meeting/>} />
                <Route path="*" element={<h1>404 Not Found</h1>} />
            </Routes>
        </Router>
    )
}

export default Routing;