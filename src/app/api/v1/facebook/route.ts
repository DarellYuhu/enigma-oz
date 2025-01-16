import { getFacebookApi } from "@/app/api/utils";

export const GET = async () => {
  const response = await fetch(`${await getFacebookApi()}/api/v1/project/cat`, {
    method: "POST",
    body: JSON.stringify({ type: "listAllProjects" }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return Response.json(data);
};

export const dynamic = "force-dynamic";
