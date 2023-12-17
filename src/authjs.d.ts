import { DefaultSession, DefaultUser } from "@auth/core";

declare module "@auth/core/types" {
  interface User extends DefaultUser {
  }
  interface Session {
    supabaseAccessToken?: string
    user?: User;
  }
}