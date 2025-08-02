import { useEffect, useRef, useContext, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/authContext";

const ChatContainer = () => {
    const {
        selectedUser,
        setSelectedUser,
        messages,
        getMessages,
        sendMessage,
    } = useContext(ChatContext);
    const { authUser, onlineUsers } = useContext(AuthContext);
    const [inputMessage, setInputMessage] = useState("");

    const scrollToEnd = useRef();

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return null;
        await sendMessage({ text: inputMessage.trim() });
        setInputMessage("");
    };

    // handel image sending
    const handleImageSend = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) {
            toast.error("Please select a valid image file.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const imageData = reader.result;
            await sendMessage({ image: imageData });
            e.target.value = ""; // Reset the input field
        };

        reader.readAsDataURL(file);
    };

    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id);
        }
    }, [selectedUser]);

    useEffect(() => {
        if (scrollToEnd.current && messages.length > 0) {
            scrollToEnd.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return selectedUser ? (
        <div className="h-full overflow-scroll relative backdrop-blur-lg">
            {/* header part of the chat section */}
            <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
                <img
                    src={selectedUser.profilePic || assets.profile_martin}
                    alt="profile-image"
                    className="w-8 rounded-full"
                />

                <p className="flex-1 text-lg text-white flex items-center gap-2">
                    {selectedUser.fullName}
                    {onlineUsers.includes(selectedUser._id) && (
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                    )}
                </p>

                <img
                    src={assets.arrow_icon}
                    alt="arrow-icon"
                    className="md:hidden max-w-7"
                    onClick={() => setSelectedUser(null)}
                />
                <img
                    src={assets.help_icon}
                    alt="help-icon"
                    className="max-md:hidden max-w-5"
                />
            </div>

            {/* chat section of the chat container  */}

            <div
                className="flex flex-col p-3 pb-6 overflow-y-scroll"
                style={{ height: "calc(100% - 120px)" }}
            >
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex items-end gap-2 justify-end ${
                            msg.senderId !== authUser._id && "flex-row-reverse"
                        }`}
                    >
                        {msg.image ? (
                            <img
                                src={msg.image}
                                alt="image-msg"
                                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
                            />
                        ) : (
                            <p
                                className={`p-2 max-w-[200px] md:text:sm fony-light rounded-lg mb-8 break-all bg-violet-500/30 text-white 
                                    ${
                                        msg.senderId === authUser._id
                                            ? "rounded-br-none"
                                            : "rounded-bl-none"
                                    }`}
                            >
                                {msg.text}
                            </p>
                        )}

                        <div className="text-center text-xs">
                            <img
                                src={
                                    msg.senderId === authUser._id
                                        ? authUser?.profilePic ||
                                          assets.avatar_icon
                                        : selectedUser?.profilePic ||
                                          assets.avatar_icon
                                }
                                alt="asstes-image"
                                className="w-7 rounded-full"
                            />
                            <p className="text-gray-500 mt-1">
                                {" "}
                                {formatMessageTime(msg.createdAt)}{" "}
                            </p>
                        </div>
                    </div>
                ))}

                <div ref={scrollToEnd}></div>
            </div>

            {/* bottom area of the ChatContainer */}
            <div className="absolute bottom-0 left-0  right-0 flex items-center gap-3 p-3">
                <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
                    <input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === "Enter" ? handleSendMessage(e) : null
                        }
                        type="text"
                        placeholder="Send a message..."
                        className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
                    />
                    <input
                        type="file"
                        id="image"
                        accept="image/png, image/jpg"
                        hidden
                        onChange={handleImageSend}
                    />
                    <label htmlFor="image">
                        <img
                            src={assets.gallery_icon}
                            alt="gallery-icon"
                            className="w-5 mr-2 cursor-pointer"
                        />
                    </label>
                </div>

                <img
                    src={assets.send_button}
                    alt="send-btn-image"
                    className="w-7 cursor-pointer"
                    onClick={handleSendMessage}
                />
            </div>
        </div>
    ) : (
        <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
            <img src={assets.logo} alt="logo" className="max-w-16" />
            <p className="text-lg font-medium text-white">
                Chat anytime, anywhere
            </p>
        </div>
    );
};

export default ChatContainer;
