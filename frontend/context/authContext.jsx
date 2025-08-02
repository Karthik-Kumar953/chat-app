import { createContext } from "react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { io } from "socket.io-client";

export const AuthContext = createContext();
const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    const ckeckAuth = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const data = await axios.get("/auth/is-auth");

            if (data.status) {
                setAuthUser(data.data.user);
                connectSocket(data.data.user);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // * Login functions to handle the user authentication and socket connection
    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`auth/${state}`, credentials);

            if (data.success) {
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message);
            } else {
                toast.error(data.message || "Authentication failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // * function to logout and disconnect the socket connection.
    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"] = null;
        toast.success("Loggged Out Successfully!");
        socket.disconnect();
    };

    // * Update user functions to handle the updates
    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put("auth/update-profile", body, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile Updated Successfully!");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // * Socket function to handle the socket connection and online users updates.
    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return;

        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            },
        });

        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        });
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        ckeckAuth();
    }, []);

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;
