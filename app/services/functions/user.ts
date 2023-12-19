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
