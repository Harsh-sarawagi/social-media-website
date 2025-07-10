
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateAccount from "./pages/createaccount";
import VerifyEmail from "./pages/verifyemail";
import Login from "./pages/login";
import Protectedroutes from "./api/protectedroutes.jsx";
import Home from "./pages/home";
import ProfilePage from "./pages/profile.jsx";
import SettingsPage from "./pages/settings.jsx";
import CreatePost from "./pages/createpost.jsx";
import PostCard from "./pages/postcard.jsx";
import ForgotPassword from "./pages/forgotpassword.jsx";
import ResetPassword from "./pages/resetpassword.jsx";


const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<CreateAccount />} />
        <Route path="/verify-email" element={<VerifyEmail/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword/>}/>
        <Route path="/reset-password" element={<ResetPassword/>}/>

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
      </Routes>
    </BrowserRouter>
  );
};

export default App;
