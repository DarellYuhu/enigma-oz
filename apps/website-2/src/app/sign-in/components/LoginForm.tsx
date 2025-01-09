"use client";
// import { signIn } from "@/lib/auth";
import { Lock, User } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "ui/components/";

const LoginForm = ({ csrfToken }: { csrfToken: string }) => {
  // const { mutate, isPending } = useLogin();
  // const form = useForm<FormSchema>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: { username: "", password: "" },
  // });

  // const handleSubmit = async (event: any) => {
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);
  //   console.log(formData.get("username"));
  //   await fetch("/api/auth/signin", {
  //     method: "POST",
  //     body: formData,
  //     headers: {},
  //   });
  // };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="sm:text-center text-xl">Welcome back</CardTitle>
        <CardDescription className="sm:text-center">
          Enter your credentials to log in to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <Input type="hidden" name="csrfToken" value={csrfToken} />
          <div className="space-y-2">
            <Label>Username</Label>
            <div className="relative">
              <Input
                name="username"
                className="peer pe-9"
                placeholder="Enter your username"
              />
              <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
                <User size={16} strokeWidth={2} aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <div className="relative">
              <Input className="pe-9" placeholder="Enter your password" />
              <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
                <Lock size={16} strokeWidth={2} aria-hidden="true" />
              </div>
            </div>
          </div>
          <div className="flex justify-between gap-2"></div>

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
