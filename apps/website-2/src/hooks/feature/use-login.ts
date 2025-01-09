import { signIn } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (values: { username: string; password: string }) => {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("password", values.password);
      await signIn("credentials", formData);
      // console.log(values);
      // const { data }: { data: Data } = await FacebookClient.post(
      //   "/auth/sign-in",
      //   values
      // );
      // return data;
    },
    onError: () => {
      toast.error("Login fail!");
    },
    // onSuccess: (data) => {
    //   // setToken(data.token);
    //   // setUser(data.user);
    //   toast.success("Login success!");
    // },
  });
};

// type Data = {
//   token: string;
//   user: {
//     id: string;
//     displayName: string;
//     username: string;
//     role: string;
//   };
// };
