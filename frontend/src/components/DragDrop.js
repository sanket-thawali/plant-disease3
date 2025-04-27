import React from "react";
import "../css/DragDrop.css";

const DragDrop = () => {
  const handleClick = () => {
    window.open("https://plant-disease-esbbmdl9nmfc6nvpt9h8ti.streamlit.app/", "_blank");
  };

  return (
    <div className="upload-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
      <button type="button" onClick={handleClick} className="upload-button">
        Click here to upload image
      </button>
    </div>
  );
};

export default DragDrop;
