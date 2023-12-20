import { FormEvent, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import Background from "@/components/Background";
import profileImageUrl from "@/assets/images/profile.jpg";
import { SkeletonItem } from "@/components/Skeleton";
import AvatarUploadModal from "./AvatarUploadModal";
import CameraIcon from "@/assets/icons/camera.svg";
import { UserWithProfile } from "@/types";
import { updateUserProfile } from "@/services/functions/user";
import message from "@/components/Message/message";
import { FetchState } from "@/services";

type IntroductionProps = {
  profile: FetchState<UserWithProfile>;
  isSelfUser: boolean;
  token?: string;
};

export default function Introduction(props: IntroductionProps) {
  const { profile, token, isSelfUser } = props;
  const [isUpdating, setIsUpdating] = useState(false);
  const abortControllerRef = useRef<AbortController>();
  const [isShowAvatarUploadModal, setIsShowAvatarUploadModal] = useState(false);
  const [avatar, setAvatar] = useState<string>();
  const [introduction, setIntroduction] = useState<string>();

  function handleSaveIntroduction(e: FormEvent) {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    if ((!introduction && !value) || introduction === value) {
      return;
    }
    if (isUpdating) {
      abortControllerRef.current!.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsUpdating(true);
    updateUserProfile({ introduction: value }, token!, controller.signal)
      .then((isSuccess) => {
        abortControllerRef.current = undefined;
        if (isSuccess) {
          setIntroduction(value);
        }
      })
      .finally(() => {
        setIsUpdating(false);
      });
  }

  function handleAvatarUplaoded(avatar: string) {
    setAvatar(avatar);
    setIsShowAvatarUploadModal(false);
    message({ type: "success", message: "修改成功" });
  }

  useEffect(() => {
    if (profile.isSuccess) {
      setAvatar(profile.result.avatar);
      setIntroduction(profile.result.introduction);
    }
  }, [profile]);

  return (
    <>
      <Background
        imageUrl={profileImageUrl}
        className="flex flex-col justify-center items-center text-white"
      >
        <div className="relative h-40 w-40 rounded-full bg-[rgba(255,255,255,0.5)] overflow-hidden">
          {avatar && (
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
            profile.isSuccess && (
              <input
                className={classNames(
                  "w-[50vw] text-center px-2 py-[2px] rounded",
                  "bg-transparent border-none outline-none",
                  "placeholder:text-white",
                  isSelfUser &&
                    "focus:bg-[rgba(255,255,255,0.8)] focus:text-black focus:placeholder:text-gray-500 transition-all duration-300",
                )}
                onBlur={isSelfUser ? handleSaveIntroduction : undefined}
                maxLength={50}
                readOnly={!isSelfUser}
                placeholder={isSelfUser ? "这个人没什么可说的" : undefined}
                defaultValue={
                  isSelfUser
                    ? profile.result.introduction
                    : profile.result.introduction || "这个人没什么可说的"
                }
              />
            )
          )}
        </div>
      </Background>
      <AvatarUploadModal
        visible={isShowAvatarUploadModal}
        onClose={() => setIsShowAvatarUploadModal(false)}
        onAvatarUploaded={handleAvatarUplaoded}
      />
    </>
  );
}
