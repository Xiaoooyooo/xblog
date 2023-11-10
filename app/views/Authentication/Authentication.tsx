import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "@/hooks/redux";
import Input from "@/components/Input";
import { Form, FormItem } from "@/components/Form";
import Button from "@/components/Button";
import imageUrl from "@/assets/images/winter.jpg";
import { login } from "@/redux/actions/user";

export default function Authentication() {
  const [authState, setAuthState] = useState({ username: "", password: "" });
  const [isPending, setIsPending] = useState(false);
  const isLogin = useSelector((state) => state.user.isLogin);
  const dispatch = useDispatch();

  const handleLogin = function () {
    if (!authState.password || authState.username) return;
    setIsPending(true);
    dispatch(login(authState))
      .then((res) => {
        console.log("login res", res);
        if ("error" in res) {
          console.log(res.error.message);
        }
      })
      .finally(() => {
        setIsPending(false);
      });
  };
  __DEV__ && console.log({ isLogin });
  if (isLogin) return <Navigate to={{ pathname: "/" }} replace />;
  return (
    <div
      style={{ backgroundImage: `url(${imageUrl})` }}
      className="h-full bg-cover bg-center bg-no-repeat"
    >
      <div className="h-full flex items-center justify-center backdrop-blur-md">
        <div className="rounded bg-white flex h-[500px] shadow overflow-hidden">
          <div
            style={{ backgroundImage: `url(${imageUrl})` }}
            className="w-[450px] bg-cover bg-center bg-no-repeat"
          ></div>
          <div className="w-[350px] p-6">
            <Form className="mt-12">
              <FormItem label="Username">
                <Input
                  value={authState.username}
                  onInput={(username) =>
                    setAuthState({ ...authState, username })
                  }
                />
              </FormItem>
              <FormItem label="Password">
                <Input
                  type="password"
                  value={authState.password}
                  onInput={(password) =>
                    setAuthState({ ...authState, password })
                  }
                />
              </FormItem>
              <FormItem>
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleLogin}
                  loading={isPending}
                >
                  Confirm
                </Button>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
