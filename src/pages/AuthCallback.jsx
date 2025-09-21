import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const oauthStatus = searchParams.get("oauth");
  const userId = searchParams.get("userid");


  useEffect(() => {
    if (oauthStatus === "success" && token) {
      window.opener.postMessage(
        {
          type: "oauthSuccess",
          token: token,
          userId: userId,
        },
        window.location.origin
      );

      window.close();
    }
  }, []);

  return oauthStatus === "success" ? (
    <h1>Sign in sucessful, you may now close this window</h1>
  ) : (
    <h1>Sign in failed, please try again or log in using email/passowrd</h1>
  );
}
