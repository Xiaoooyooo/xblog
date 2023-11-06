import homeImage from "@/assets/images/eyes.jpg";
import Background from "@/components/Background";
import ContentContainer from "@/components/ContentContainer";
import HomeBlogList from "@/components/HomeBlogList";

export default function HomeScence() {
  return (
    <>
      <Background imageUrl={homeImage} />
      <ContentContainer>
        <HomeBlogList />
      </ContentContainer>
    </>
  );
}
