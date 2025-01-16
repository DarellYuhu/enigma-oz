import { getFacebookApi } from "@/app/api/utils";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const searchParams = req.nextUrl.searchParams;
  const since = searchParams.get("since");
  const until = searchParams.get("until");
  const response = await fetch(
    `${await getFacebookApi()}/api/v1/project/statistics`,
    {
      method: "POST",
      body: JSON.stringify({
        project: params.id,
        type: "statistics",
        since,
        until,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return Response.json(data);
};
