import { Blog, Category, Profile, User } from "~/types";

/** Remove some unnecessary fields from user */
export function normalizeUser<T extends User>(user: T): User {
  const { id, displayName, username, role } = user;
  return { id, displayName, username, role };
}

/** Remove unnecessary fields from user's profile */
export function normalizeProfile<T extends Profile>(profile: T) {
  const { avatar, introduction, resume } = profile;
  return { avatar, introduction, resume };
}

/** Remove unnecessary fields from blog */
export function normalizeBlog<T extends Blog>(blog: T): Blog {
  const { id, content, createdAt, updatedAt, title, isDraft, views } = blog;
  return { id, content, createdAt, updatedAt, title, isDraft, views };
}

/** Remove unnecessary fields from category */
export function normalizeCategory<T extends Category>(category: T): Category {
  const { id, name } = category;
  return { id, name };
}
