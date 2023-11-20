import Background from "@/components/Background";
import ContentContainer from "@/components/ContentContainer";
import HomeBlogList from "@/views/Home/HomeBlogList";
import homeImage from "@/assets/images/forest.jpg";

export default function HomeScence() {
  return (
    <>
      <Background imageUrl={homeImage} shift />
      <ContentContainer>
        <HomeBlogList />
      </ContentContainer>
    </>
  );
}
