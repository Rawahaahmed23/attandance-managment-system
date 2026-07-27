import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  const isLogin = !!user;

  const saveToken = async (serverToken) => {
    try {
   Cookies.set("token", serverToken, {
  expires: 7,
  secure: true, 
  sameSite: "None", 
});
    } catch (error) {
    console.log(error);
    }
  };

  const Logout = async (serverToken) => {
    try {
      const savetoken = Cookies.remove("token");
    } catch (error) {}
  };


  useEffect(() => {
 
    const userAuthentication = async () => {
      try {
            
        const token = Cookies.get("token");
        const response = await fetch("https://mern-projects-oj9w.onrender.com/user", {
            method: "GET",
                 credentials: "include",
              headers: {
      Authorization: `Bearer ${token}`
    }
                 
       
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          
        }

   
      } catch (error) {
        console.log("User fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    
    userAuthentication();

    const timer = setTimeout(() => {
      userAuthentication();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <UserContext.Provider
      value={{ user, Logout, isLogin, setUser, loading, saveToken }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  const contextvalue = useContext(UserContext);
  if (!contextvalue) {
    throw new Error("useAuth must be used inside UserProvider");
  }
  return contextvalue;
};
