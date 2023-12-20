import { useParams } from "react-router-dom";
import { useUserProfile } from "@/services/user";
import { useSelector } from "@/hooks/redux";
import Introduction from "./Introduction";
import Resume from "./Resume";

type ProfileSecnceParams = {
  userId: string;
};

export default function ProfileScence() {
  const params = useParams<ProfileSecnceParams>();
  const profile = useUserProfile(params.userId!);
  const user = useSelector((state) => state.user);

  const isSelfUser =
    user.isLogin && profile.isSuccess && user.id === profile.result.id;

  return (
    <>
      <Introduction
        profile={profile}
        isSelfUser={isSelfUser}
        token={user.token}
      />
      <Resume profile={profile} isSelfUser={isSelfUser} token={user.token} />
    </>
  );
}
