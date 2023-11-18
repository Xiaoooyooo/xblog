import homeImage from "@/assets/images/eyes.jpg";
import Background from "@/components/Background";
import ContentContainer from "@/components/ContentContainer";
import HomeBlogList from "@/views/Home/HomeBlogList";

export default function HomeScence() {
  return (
    <>
      <Background imageUrl={homeImage} shift backgroundFixed />
      <ContentContainer>
        <HomeBlogList />
      </ContentContainer>
    </>
  );
}
