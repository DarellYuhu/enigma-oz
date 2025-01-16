import prisma from "../database";

const getYoutubeApi = async () => {
  const res = await prisma.apiUrl.findUnique({
    where: { id: "youtube" },
  });
  return res?.url;
};

const getTiktokApi = async () => {
  const res = await prisma.apiUrl.findUnique({
    where: { id: "tiktok" },
  });
  return res?.url;
};

const getTwitterApi = async () => {
  const res = await prisma.apiUrl.findUnique({
    where: { id: "twitter" },
  });
  return res?.url;
};

const getFacebookApi = async () => {
  const res = await prisma.apiUrl.findUnique({
    where: { id: "facebook" },
  });
  return res?.url;
};

export { getYoutubeApi, getTiktokApi, getTwitterApi, getFacebookApi };
