import { useEffect, useState } from "react";
import Background from "@/components/Background";
import ContentContainer from "@/components/ContentContainer";
import { useParams } from "react-router-dom";
import profileImageUrl from "@/assets/images/profile.jpg";
import { useUserProfile } from "@/services/user";
import Skeleton, { SkeletonItem } from "@/components/Skeleton";
import Markdown from "@/components/Markdown";
import Button from "@/components/Button";
import AvatarUploadModal from "./AvatarUploadModal";
import { useSelector } from "@/hooks/redux";
import CameraIcon from "@/assets/icons/camera.svg";
import message from "@/components/Message/message";

type ProfileSecnceParams = {
  userId: string;
};

export default function ProfileScence() {
  const params = useParams<ProfileSecnceParams>();
  const profile = useUserProfile(params.userId!);
  const [isShowAvatarUploadModal, setIsShowAvatarUploadModal] = useState(false);
  const user = useSelector((state) => state.user);
  const [avatar, setAvatar] = useState<string>();

  function handleAvatarUplaoded(avatar: string) {
    setAvatar(avatar);
    setIsShowAvatarUploadModal(false);
    message({ type: "success", message: "修改成功" });
  }

  useEffect(() => {
    console.log({ profile });
    if (profile.isSuccess) {
      setAvatar(profile.result.avatar);
    }
  }, [profile]);

  const isSelfUser =
    user.isLogin && profile.isSuccess && user.id === profile.result.id;

  return (
    <>
      <Background
        imageUrl={profileImageUrl}
        className="flex flex-col justify-center items-center text-white"
      >
        <div className="relative h-40 w-40 rounded-full bg-[rgba(255,255,255,0.5)] overflow-hidden">
          {profile.isSuccess && (
            <>
              <img
                className="w-full h-full"
                src={`/assets/avatar/${avatar}`}
                alt={avatar}
              />
              {isSelfUser && (
                <span
                  className="cursor-pointer absolute inset-0 bg-white opacity-0 hover:opacity-30 transition-opacity duration-200"
                  onClick={() => setIsShowAvatarUploadModal(true)}
                >
                  <CameraIcon
                    className="relative h-20 w-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    fill="black"
                  />
                </span>
              )}
            </>
          )}
        </div>
        <h2 className="mt-6 text-3xl">
          {profile.isLoading ? (
            <SkeletonItem animated height={36} width="10em" />
          ) : profile.isSuccess ? (
            profile.result.username
          ) : (
            "-"
          )}
        </h2>
        <div className="mt-4 text-sm">
          {profile.isLoading ? (
            <SkeletonItem height={20} width="20em" animated />
          ) : (
            <p>
              {profile.isSuccess
                ? profile.result.introduction || "这个人没什么可说的。"
                : "-"}
            </p>
          )}
        </div>
      </Background>
      <ContentContainer className="pt-6">
        {profile.isLoading ? (
          <Skeleton animated />
        ) : profile.isSuccess ? (
          profile.result.resume ? (
            <Markdown text={profile.result.resume} />
          ) : (
            <p>这个人很神秘，什么都没留下......</p>
          )
        ) : (
          "error"
        )}
      </ContentContainer>
      <AvatarUploadModal
        visible={isShowAvatarUploadModal}
        onClose={() => setIsShowAvatarUploadModal(false)}
        onAvatarUploaded={handleAvatarUplaoded}
      />
    </>
  );
}
