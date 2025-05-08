import React from "react";

const Background = () => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-screen -z-10 backdrop-blur"
      style={{
        background:
          "url('./images/bg-main.png') no-repeat center center/cover",
        opacity: 0.5,
      }}
    ></div>
  );
};

export default Background;
