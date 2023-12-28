import { useEffect, useRef, useState } from "react";
import ContentContainer from "@/components/ContentContainer";
import Skeleton from "@/components/Skeleton";
import Markdown from "@/components/Markdown/Markdown";
import Button from "@/components/Button";
import { UserWithProfile } from "@/types";
import Editor from "@/components/Editor";
import { FetchState } from "@/services";
import { updateUserProfile } from "@/services/functions/user";

type ResumeProps = {
  profile: FetchState<UserWithProfile>;
  isSelfUser: boolean;
  token?: string;
};

export default function Resume(props: ResumeProps) {
  const { profile, token, isSelfUser } = props;
  const [resume, setResume] = useState<string>();
  const [isEdit, setIsEdit] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const editTextRef = useRef("");
  const abortControllerRef = useRef<AbortController>();

  function handleClick() {
    if (!isEdit) {
      editTextRef.current = resume || "";
      setIsEdit(true);
    } else {
      const value = editTextRef.current;
      if ((!resume && !value) || resume === value) {
        setIsEdit(false);
        return;
      }
      setIsUpdateLoading(true);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;
      updateUserProfile({ resume: value }, token!, controller.signal)
        .then((isSuccess) => {
          abortControllerRef.current = undefined;
          if (isSuccess) {
            setResume(value);
          }
        })
        .finally(() => {
          setIsUpdateLoading(false);
          setIsEdit(false);
        });
    }
  }

  useEffect(() => {
    if (profile.isSuccess) {
      setResume(profile.result.resume || "");
    }
  }, [profile]);

  return (
    <ContentContainer className="pt-6">
      {profile.isLoading ? (
        <Skeleton animated />
      ) : (
        <>
          {isSelfUser && (
            <div className="mb-4 flex gap-x-4 justify-end">
              {isEdit && <Button onClick={() => setIsEdit(false)}>取消</Button>}
              <Button onClick={handleClick} loading={isUpdateLoading}>
                {isEdit ? "保存" : "编辑"}
              </Button>
            </div>
          )}
          {profile.isSuccess ? (
            isEdit ? (
              <Editor
                initialText={resume}
                onChange={(text) => (editTextRef.current = text)}
              />
            ) : resume ? (
              <Markdown text={resume} />
            ) : (
              <p>这个人很神秘，什么都没留下......</p>
            )
          ) : (
            profile.error
          )}
        </>
      )}
    </ContentContainer>
  );
}
