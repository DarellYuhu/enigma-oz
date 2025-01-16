import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const since = searchParams.get("since");
  const until = searchParams.get("until");
  const response = await fetch(`http://172.233.75.107:89124/api/geo`, {
    method: "POST",
    body: JSON.stringify({
      type: "get-region-top",
      category,
      since,
      until,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return Response.json(data);
}
