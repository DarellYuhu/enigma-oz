import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const level = searchParams.get("level");
  const since = searchParams.get("since");
  const until = searchParams.get("until");
  const details = searchParams.get("details");

  const response = await fetch(`http://172.233.75.107:8912/api/trends`, {
    method: "POST",
    body: JSON.stringify({
      type: "get-trends",
      category,
      level,
      since,
      until,
      details,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return Response.json(data);
}
