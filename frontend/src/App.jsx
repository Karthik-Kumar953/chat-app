import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import ProfilePage from "./Pages/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const App = () => {
    const { authUser } = useContext(AuthContext);

    return (
        <div className="min-h-screen w-full bg-[url('/bgImage.svg')] bg-cover  bg-center ">
            <Toaster />
            <Routes>
                <Route
                    path="/"
                    element={authUser ? <HomePage /> : <Navigate to="/login" />}
                />
                <Route
                    path="/login"
                    element={authUser ? <Navigate to="/" /> : <LoginPage />}
                />
                <Route
                    path="/profile"
                    element={
                        authUser ? <ProfilePage /> : <Navigate to="/login" />
                    }
                />
            </Routes>
        </div>
    );
};

export default App;
