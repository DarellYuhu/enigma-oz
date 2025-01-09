import { cookies } from "next/headers";
import LoginForm from "./components/LoginForm";
// import { signIn } from "@/lib/auth";
// import { Lock, User } from "lucide-react";
// import {
//   Button,
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
//   Input,
//   Label,
// } from "ui/components/";

const LoginPage = async () => {
  const csrfToken = await cookies().then(
    (cookies) => cookies.get("authjs.csrf-token")?.value ?? ""
  );

  return (
    <div className="flex h-screen items-center justify-center">
      <LoginForm csrfToken={csrfToken} />
    </div>
  );
};

export default LoginPage;
