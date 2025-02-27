import { Route, Routes,  } from "react-router-dom";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import Private from "./private";
import Profile from "../pages/Profile";
import Custumers from "../pages/Custumers";



function RoutesApp(){
    return (
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <Private>
              <Dashboard />
            </Private>
          }
        />
        <Route
          path="/profile"
          element={
            <Private>
              <Profile />
            </Private>
          }
        />

        <Route path="/custumers" element={<Private><Custumers/></Private>}/>
      </Routes>
    );
}

export default RoutesApp;