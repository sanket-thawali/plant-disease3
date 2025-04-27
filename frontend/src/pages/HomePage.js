import React, { useEffect, useState, useContext } from "react";
// import { Link } from "react-router-dom";
import heroImage from "../images/hero-image.jpg";
// import infoImage from "../images/info.jpg";
import scanImage from "../images/scan.jpg";
import diagnoseImage from "../images/diagnose.jpg";
import treatmentImage from "../images/treatment.jpg";

import Aos from "aos";
import "aos/dist/aos.css";

import { AuthContext } from "../context/AuthContext";
import "../css/Popup.css";

const HomePage = (props) => {
  const { user } = useContext(AuthContext);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  setTimeout(() => {
    props.alterPrediction(false);
    props.alterLogin(false);
  }, 100);

  const handleGetStartedClick = () => {
    if (user) {
      window.open("https://plant-disease-ml-n6twjrlm8hruudgel9hs6h.streamlit.app/", "_blank");
      setShowPopup(false);
    } else {
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="container-homePage">
      <section className="section1 section">
        <img src={heroImage} alt="" />
        <div className="overlay">
          <h1 className="center-title" data-aos="fade-left"><span className="E">ई</span>-<span>कृषी</span> <span className="tech">TECH</span></h1>
          <h2 data-aos="fade-right">From Diagnosis To Solution</h2>
          <p className="tagline" data-aos="zoom-in" data-aos-duration="1200">
            The Future of Plant Health is Here
          </p>
          <button onClick={handleGetStartedClick}>Get Started</button>
        </div>
        <svg className="arrows">
          <path className="a1" d="M0 0 L15 16 L30 0"></path>
          <path className="a2" d="M0 15 L15 31 L30 15"></path>
          <path className="a3" d="M0 30 L15 46 L30 30"></path>
        </svg>
      </section>
      <section className="section2 section">
        <div className="overlay info">
          <h2>What Is ई-कृषी TECH?</h2>
          <p>
          ई-कृषी TECH is a platform that detects the diseases in crops and
            provides information and solutions for the diseases. One of the key
            features of ई-कृषी TECH is its ability to predict and diagnose crop
            diseases and pests using machine learning algorithms.
          </p>
          <h3>Connecting Agriculture and Technology</h3>
        </div>
        <svg className="arrows">
          <path className="a1" d="M0 0 L15 16 L30 0"></path>
          <path className="a2" d="M0 15 L15 31 L30 15"></path>
          <path className="a3" d="M0 30 L15 46 L30 30"></path>
        </svg>
      </section>
      <section className="section3 section">
        <h2>Key Features</h2>
        <ul>
          <li>
            <img src={scanImage} alt="" />
            <h3>Scan Your Plants</h3>
            <p>
              Simply upload a picture of your plant and let{" "}
              <span> ई-कृषी TECH
 </span> do the rest.
            </p>
          </li>
          <li>
            <img src={diagnoseImage} alt="" />
            <h3>Diagnose The Diseases</h3>
            <p>
              ई-कृषी TECH uses AI and machine learning to accurately diagnose
              plant diseases.
            </p>
          </li>
          <li>
            <img src={treatmentImage} alt="" />
            <h3>Treat and Prevent</h3>
            <p>
              We provide effective solutions and preventive measures for a
              healthy crop.
            </p>
          </li>
        </ul>
      </section>

      {showPopup && (
        <div className="popup-backdrop" onClick={closePopup}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <p>Please log in to access this feature.</p>
            <button className="popup-close-button" onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
// </create_file>
