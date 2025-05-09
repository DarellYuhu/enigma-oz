import { getTiktokApi } from "@/app/api/utils";
import { auth } from "@/lib/auth";

export const POST = auth(async function POST(request) {
  if (request.auth?.user.role === "VIEWER")
    return Response.json({ message: "Unauthorized" }, { status: 403 });
  const { projectName, keywords } = await request.json();
  const response = await fetch(
    `${await getTiktokApi()}/api/v1/project/create`,
    {
      method: "POST",
      body: JSON.stringify({ projectName, keywords }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return Response.json(data);
});
