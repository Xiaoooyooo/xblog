import request from "../request";

export function getUserProfile(id: string, signal: AbortSignal) {
  return request("/api/user/profile", {
    method: "get",
    search: { id },
    signal,
  });
}

export type AvatarUploadOption = {
  avatar: Blob;
  token: string;
};

export function uploadUserAvatar(
  option: AvatarUploadOption,
  signal?: AbortSignal,
) {
  const { avatar, token } = option;
  const data = new FormData();
  data.append("avatar", avatar);
  return request<{ avatar: string }>("/api/upload/avatar", {
    method: "post",
    headers: { Authorization: `Bearer ${token}` },
    data,
    signal,
  });
}

type UpdateUserProfileOption =
  | {
      introduction: string;
      resume?: undefined;
    }
  | {
      introduction?: undefined;
      resume: string;
    };

export function updateUserProfile(
  option: UpdateUserProfileOption,
  token: string,
  signal?: AbortSignal,
) {
  return request<boolean>("/api/user/profile/update", {
    method: "post",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    data: option,
    signal,
  });
}
