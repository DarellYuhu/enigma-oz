import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const date = searchParams.get("date");
  const window = searchParams.get("window");
  const rid = searchParams.get("rid");
  const response = await fetch(`http://172.233.75.107:89124/api/network`, {
    method: "POST",
    body: JSON.stringify({
      type: "get-network",
      category,
      date,
      window,
      rid,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return Response.json(data);
}
