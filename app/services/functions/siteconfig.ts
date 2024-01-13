import { SiteConfig } from "@/types";
import request from "../request";

export function getSiteConfig(token: string, signal?: AbortSignal) {
  return request("/api/siteconfig", {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });
}

export function updateSiteConfig(
  data: SiteConfig,
  token: string,
  signal?: AbortSignal,
) {
  return request("/api/siteconfig", {
    method: "post",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
    signal,
  });
}
