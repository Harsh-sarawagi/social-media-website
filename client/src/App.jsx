// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateAccount from "./pages/createaccount";
import VerifyEmail from "./pages/virifyemail";
import Login from "./pages/login";
import Protectedroutes from "./api/protectedroutes.jsx";
import Home from "./pages/home";
import ProfilePage from "./pages/profile.jsx";
import SettingsPage from "./pages/settings.jsx";
import CreatePost from "./pages/createpost.jsx";
import PostCard from "./pages/postcard.jsx";
// import { useEffect } from "react";
// import useAuthstore from "./store/auth-store.js";
// import API from "./api/api.js";
// import { checkAuth } from "../../server/controllers/auth-controllers.js";
// import { useEffect } from "react";
// import useAuthStore from "./store/auth-store.js";
// import Login from "./pages/login"; // example other page

const App = () => {

  // const { setUser, setIsAuthenticated } = useAuthstore();

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const res = await API.get("/auth/refresh", { withCredentials: true });
  //       setUser(res.data.user);
  //       setIsAuthenticated(true);
  //     } catch (err) {
  //       setUser(null);
  //       setIsAuthenticated(false);
  //       console.error("Auth refresh failed:", err);
  //     }
  //   };

  //   checkAuth();
  // }, []);

  // if (loading) return <div className="flex text-white ">Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<CreateAccount />} />
        <Route path="/verify-email" element={<VerifyEmail/>}/>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <Protectedroutes>
              <Home/>
            </Protectedroutes>
          }
        />
        <Route
          path="/profile/:userID"
          element={
            <Protectedroutes>
              <ProfilePage/>
            </Protectedroutes>
          }
        />
        <Route
          path="/account"
          element={
            <Protectedroutes>
              <SettingsPage/>
            </Protectedroutes>
          }
        />
        <Route
          path="/p/create"
          element={
            <Protectedroutes>
              <CreatePost/>
            </Protectedroutes>
          }
        />
        <Route
          path="/p/:postid"
          element={
            <Protectedroutes>
              <PostCard/>
            </Protectedroutes>
          }
        />
        
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
