import axios from "axios";

export const FacebookClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FACEBOOK_BASE_API_URL,
  headers: {
    Accept: "application/json",
  },
});
