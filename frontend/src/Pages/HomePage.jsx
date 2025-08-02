import { use, useState } from "react";
import Sidebar from "../Components/Sidebar";
import ChatContainer from "../Components/ChatContainer";
import RIghtSidebar from "../Components/RIghtSidebar";
import { ChatContext } from "../../context/ChatContext";

const HomePage = () => {
    const { selectedUser } = use(ChatContext);

    return (
        <main className="h-screen w-full sm:px-[15%] sm:py-[5%] border ">
            <div
                className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-full grid grid-cols-1 relative ${
                    selectedUser
                        ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
                        : "md:grid-cols-2"
                }`}
            >
                <Sidebar />
                <ChatContainer />
                <RIghtSidebar />
            </div>
        </main>
    );
};

export default HomePage;
