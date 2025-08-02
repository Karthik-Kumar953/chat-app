import {} from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./authContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unSeenMessages, setUnseenMessages] = useState({});

    const { socket, axios } = useContext(AuthContext);

    // get all users
    const getUsers = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const { data } = await axios.get("/messages/get-users");

            if (data.success) {
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // get all messages of the selected user
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/messages/${userId}`);

            if (data.success) {
                setMessages(data.messages);
                // setSelectedUser(userId);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // send message to the selected user
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(
                `/messages/send/${selectedUser._id}`,
                messageData
            );

            if (data.success) {
                setMessages((prev) => [...prev, data.newMessage]);
                // socket.emit("send-message", {
                //     ...data.message,
                //     receiverId: selectedUser,
                // });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // subscribe to new messages
    const subscribeToNewMessages = () => {
        if (!socket) return;
        socket.on("newMessage", (newMessage) => {
            if (selectedUser && selectedUser._id === newMessage.senderId) {
                setMessages((prev) => [...prev, newMessage]);
                newMessage.seen = true; // Mark as seen
                axios.put(`/messages/mark-msg/${newMessage._id}`);
            } else {
                setUnseenMessages((prev = {}) => ({
                    ...prev,
                    [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
                }));
            }
        });
    };

    // unsubscribe from new messages
    const unsubscribeFromNewMessages = () => {
        if (!socket) return;
        socket.off("newMessage");
    };

    useEffect(() => {
        subscribeToNewMessages();
        return () => {
            unsubscribeFromNewMessages();
        };
    }, [socket, selectedUser]);

    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        setMessages,
        sendMessage,
        setSelectedUser,
        unSeenMessages,
        setUnseenMessages,
        getMessages,
    };

    return (
        <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
    );
};

export default ChatProvider;
