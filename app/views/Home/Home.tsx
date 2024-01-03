import Background from "@/components/Background";
import ContentContainer from "@/components/ContentContainer";
import HomeBlogList from "@/views/Home/HomeBlogList";
import homeImage from "@/assets/images/forest.jpg";

type HomeSceneProps = {
  isDraft?: boolean;
};

export default function HomeScence(props: HomeSceneProps) {
  const { isDraft } = props;
  return (
    <>
      <Background imageUrl={homeImage} shift />
      <ContentContainer>
        <HomeBlogList isDraft={isDraft} />
      </ContentContainer>
    </>
  );
}
