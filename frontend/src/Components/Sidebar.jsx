import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo.jsx";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext.jsx";
import { ChatContext } from "../../context/ChatContext.jsx";

const Sidebar = () => {
    const navigate = useNavigate();
    const { logout, onlineUsers } = useContext(AuthContext);
    const {
        selectedUser,
        setSelectedUser,
        users,
        getUsers,
        unSeenMessages,
        setUnseenMessages,
    } = useContext(ChatContext);

    const [inputValue, setInputValue] = useState(false);

    useEffect(() => {
        getUsers();
    }, [onlineUsers]);

    const filteredUsers = inputValue
        ? users.filter((user) =>
              user.fullName.toLowerCase().includes(inputValue)
          )
        : users;

    return (
        <aside
            className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
                selectedUser ? "max-md:hidden" : ""
            }`}
        >
            <div className="pb-5">
                <div className="flex justify-between items-center">
                    <Logo width={6} />
                    <div className="relative py-2 group">
                        <img
                            src={assets.menu_icon}
                            alt="menu_icon"
                            className="max-h-5 cursor-pointer"
                        />
                        <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
                            <p
                                onClick={() => navigate("/profile")}
                                className="text-sm cursor-pointer"
                            >
                                Edit Profile
                            </p>
                            <hr className="my-2 border-t border-gray-500" />
                            <p
                                className="cursor-pointer text-sm"
                                onClick={() => logout()}
                            >
                                Logout
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#282142] rounded-full flex items-center gap-2 py-2 px-4 mt-5">
                    <img
                        src={assets.search_icon}
                        alt="search_icon"
                        className="w-3"
                    />
                    <input
                        type="text"
                        className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
                        placeholder="Search User..."
                        onChange={(e) =>
                            setInputValue(e.target.value.toLowerCase())
                        }
                    />
                </div>
            </div>

            <div className="flex flex-col">
                {filteredUsers.map((user, index) => (
                    <div
                        onClick={() => (
                            setSelectedUser(user),
                            setUnseenMessages((prev) => ({
                                ...prev,
                                [user._id]: 0,
                            }))
                        )}
                        key={index}
                        className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
                            selectedUser?._id === user._id && "bg-[#282142]/50"
                        }`}
                    >
                        <img
                            src={user?.profilePic || assets.avatar_icon}
                            className="w-[35px] aspect-[1/1] rounded-full"
                        />

                        <div className="flex flex-col leading-5">
                            <p>{user.fullName}</p>
                            {onlineUsers.includes(user._id?.toString()) ? (
                                <span className="text-green-400 text-xs">
                                    {" "}
                                    Online{" "}
                                </span>
                            ) : (
                                <span className="text-neutral-400 text-xs">
                                    {" "}
                                    Offline{" "}
                                </span>
                            )}
                        </div>

                        {unSeenMessages?.[user._id] > 0 && (
                            <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                                {" "}
                                {unSeenMessages[user._id]}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;
