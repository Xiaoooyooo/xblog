import React from "react";
import {} from "react-router-dom";

import Background from "@/components/Background";
import ContentContainer from "@/components/ContentContainer";
import image from "@/assets/images/mountain.jpg";

function AboutScence() {
  return (
    <>
      <Background imageUrl={image} />
      <ContentContainer>hey</ContentContainer>
    </>
  );
}

export default AboutScence;
