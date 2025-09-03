import { useLocalStorage } from "@uidotdev/usehooks";
import { createContext, useEffect, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import { apiUrl } from "../apiUrl";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [auth, saveAuth] = useLocalStorage("auth", {});
  const [user, setUser] = useLocalStorage("user", {});

  const location = useLocation();
  const navigate = useNavigate();

  const checkUser = async () => {
    if (
      location.pathname.includes("backoffice") &&
      !location.pathname.includes("login")
    ) {
      try {
        let response = await fetch(`${apiUrl}/auth/token`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: auth.token }),
        });

        let result = await response.json();

        if (response.status === 401) {
          saveAuth({});
          setUser({});
          navigate("/login");
        } else if (response.ok) {
          setUser(result.data);
        }
      } catch (error) {
        console.error("Netværksfejl ved token-check:", error);
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    if (!auth.token) return;

    const decodedToken = jwtDecode(auth.token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      console.log("Token er udløbet");
      signOut();
      return;
    }
    if (user && user.email) return;

    if (
      location.pathname.includes("backoffice") &&
      !location.pathname.includes("login")
    ) {
      console.log("🔐 Kalder checkUser – er i backoffice");
      checkUser();
    } else {
      console.log("🙂 checkUser kaldes ikke – ikke i backoffice");
    }
  }, [auth.token, location.pathname]);

  const token = auth.token ? auth.token : "";

  const signedIn = Boolean(auth.token);

  const loggedInUser = auth.user ? auth.user : "";

  const signIn = async (email, password) => {
    try {
      let response = await fetch(`${apiUrl}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      let result = await response.json();

      if (!response.ok) {
        console.error("Login fejl:", result.message);
        return { status: "error", message: result.message };
      }

      const user = jwtDecode(result.data.token);
      saveAuth({ token: result.data.token });
      setUser(user);

      if (user.role === "host") {
        navigate("/");
      } else {
        navigate("/events");
      }

      return { status: "ok", user };
    } catch (error) {
      console.error("Fejl ved login:", error);
      return { status: "error", message: "Netværksfejl ved login" };
    }
  };

  const getUser = () => {
    return token ? jwtDecode(token) : {};
  };

  const signOut = () => {
    saveAuth({});
    setUser({});
    navigate("/login");
  };

  const value = useMemo(
    () => ({ token, user, getUser, signIn, signOut, signedIn, loggedInUser }),
    [token, user, signedIn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
