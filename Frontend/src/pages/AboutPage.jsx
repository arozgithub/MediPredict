import React, { useState } from "react";
import "../App.css";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import Modal from "react-modal";

// import team01 from "../assets/AboutImg/team-01.jpg";
// import team02 from "../assets/AboutImg/team-02.jpg";
// import team03 from "../assets/AboutImg/team-03.jpg";
// import team04 from "../assets/AboutImg/team-04.jpg";
import formal from "../assets/AboutImg/formal.jpg";
import hussain from "../assets/AboutImg/hussain.jpg";

// Define team members
const teamMembers = [
  {
    imgUrl: formal,
    name: "Aroz Imran",
    position: "MERN Stack Developer $ AI Engineer",
    linkedin: "https://www.linkedin.com/in/aroz-imran-5828b024b/",
    github: "https://github.com/arozgithub",
    
  },
  {
    imgUrl: hussain,
    name: "Hussain Rizvi",
    position: "Full Stack & Machine Learning Developer",
    linkedin: "",
    github: "",

  }
  
];

// Custom modal styles
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "90%",
    maxHeight: "90%",
    overflow: "hidden",
    padding: 0,
    border: "none",
    borderRadius: "10px",
    transition: "opacity 0.5s ease, transform 0.5s ease",
    opacity: 0,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    transition: "opacity 0.5s ease",
  },
};

Modal.setAppElement("#root");

function AboutPage() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalIsOpen(true);
    setTimeout(() => {
      document.querySelector(".ReactModal__Content").style.opacity = 1;
      document.querySelector(".ReactModal__Content").style.transform =
        "translate(-50%, -50%) scale(1)";
    }, 1);
  };

  const closeModal = () => {
    document.querySelector(".ReactModal__Content").style.opacity = 0;
    document.querySelector(".ReactModal__Content").style.transform =
      "translate(-50%, -50%) scale(0.8)";
    setTimeout(() => {
      setModalIsOpen(false);
      setSelectedImage("");
    }, 500);
  };

  return (
    <section className="our__team">
      <div className="container">
        <div className="team__content">
          <h6 className="subtitle">Bonjour</h6>
          <h2>
            Meet <span className="highlight">Our Team</span>
          </h2>
        </div>
        <div className="team__wrapper">
          {teamMembers.map((item, index) => (
            <div className="team__item" key={index}>
              <div className="team__img">
                <img
                  src={item.imgUrl}
                  alt={item.name}
                  onClick={() => openModal(item.imgUrl)}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <div className="team__details">
                <h4>{item.name}</h4>
                <p className="description">{item.position}</p>
                <div className="team__member-social">
                  <span>
                    <a
                      href={item.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin />
                    </a>
                  </span>
                  <span>
                    <a
                      href={item.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaGithub />
                    </a>
                  </span>
                  <span>
                    <a
                      href={item.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaInstagram />
                    </a>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Enlarged Image"
      >
        <img src={selectedImage} alt="Enlarged view" className="modal-image" />
      </Modal>
    </section>
  );
}

export default AboutPage;
