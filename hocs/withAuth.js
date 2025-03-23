// src/hocs/withAuth.js
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();

    useEffect(() => {
      const isAuthen = true;
      const token = localStorage.getItem("accessToken");

      if (!isAuthen) {
        router.push("/signin");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
