import { getFacebookApi } from "@/app/api/utils";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const searchParams = req.nextUrl.searchParams;
  const date = searchParams.get("date");
  const response = await fetch(
    `${await getFacebookApi()}/api/v2/project/topics`,
    {
      method: "POST",
      body: JSON.stringify({
        project: params.id,
        type: "topics",
        date,
        window: 4,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return Response.json(data);
};
