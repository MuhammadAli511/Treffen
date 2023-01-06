import Lottie from "lottie-react";
import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from "../../components/Navbar";
import Room from "../../components/Room";
import firstLottie from "../../public/assets/firstLottie.json";
import "./main.css";
export default function Main() {

    return(
        <div className="mainPage">
            <Helmet>
                <style>{'body { background-color: #191919; }'}</style>
            </Helmet>
            <Navbar/>
            <div className="body">
                <Room/>
                
                <div className="lottie-class">
                    <Lottie animationData={firstLottie} loop={true}/>
                </div>
               
            </div>
        </div>
    )
}