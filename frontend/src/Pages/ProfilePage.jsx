import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

const ProfilePage = () => {
    const { updateProfile, authUser } = useContext(AuthContext);
    const [selectedImage, setSelectedImage] = useState(
        authUser.profilePic || null
    );
    const navigate = useNavigate();
    const [name, setName] = useState(authUser.fullName);
    const [bio, setBio] = useState(authUser.bio);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitHandler = async (e) => {
        // 🛑 Prevent page refresh or default form submit behavior
        e.preventDefault();

        // 🕒 Set UI to a submitting state (e.g., show spinner or disable button)
        setIsSubmitting(true);

        // 📦 If no image was selected, send only name and bio
        if (!selectedImage) {
            await updateProfile({ fullName: name, bio }); // Update profile with basic data
            navigate("/"); // Redirect to homepage or dashboard
            return; // Exit function early
        }

        //         Why Convert an Image to Base64?
        // Here’s why it’s useful when uploading images in web applications:
        // ✅ 1. Embedding Image into a JSON Request
        // - REST APIs typically accept payloads in JSON.
        // - Binary data (like images) can’t be directly included in JSON.
        // - Base64 encodes the image as a text string, allowing you to include it in the request body:
        // {
        //   "fullName": "Karthik",
        //   "bio": "Creative Developer",
        //   "ProfilePic": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
        // }

        // 🖼️ If image exists, prepare to convert it into base64 format
        const reader = new FileReader(); // Utility to read file as base64
        reader.readAsDataURL(selectedImage); // Begin reading file asynchronously

        // ✅ When reading is complete, send full data including encoded image
        reader.onload = async () => {
            const base64Image = reader.result; // Get the base64 string of the image

            await updateProfile({
                profilePic: base64Image, // Attach image as base64
                fullName: name,
                bio,
            });

            navigate("/"); // Redirect user after submission
        };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex items-center justify-center p-4">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white/10"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 200 + 50}px`,
                            height: `${Math.random() * 200 + 50}px`,
                            transform: `translate(-50%, -50%)`,
                            opacity: 0.1 + Math.random() * 0.2,
                        }}
                    />
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-10 w-full max-w-4xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                {/* Left side - Form */}
                <div className="flex-1 p-8 md:p-10">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-1">
                            Profile Settings
                        </h2>
                        <p className="text-white/70">
                            Update your personal information
                        </p>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-6">
                        {/* Profile Picture Upload */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white/70">
                                Profile Picture
                            </label>
                            <div className="flex items-center gap-4">
                                <label
                                    htmlFor="avatar"
                                    className="relative group cursor-pointer"
                                >
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-violet-400 transition-colors">
                                        <img
                                            src={
                                                selectedImage
                                                    ? selectedImage
                                                    : assets.avatar_icon
                                            }
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="file"
                                        accept=".jpg,.png,.jpeg"
                                        hidden
                                        id="avatar"
                                        onChange={(e) =>
                                            setSelectedImage(e.target.files[0])
                                        }
                                    />
                                </label>
                                <div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            document
                                                .getElementById("avatar")
                                                .click()
                                        }
                                        className="text-sm px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
                                    >
                                        Change Photo
                                    </button>
                                    <p className="text-xs text-white/50 mt-1">
                                        JPG, PNG or JPEG (max. 5MB)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Name Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-white/70"
                            >
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Your name"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Bio Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="bio"
                                className="block text-sm font-medium text-white/70"
                            >
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                required
                                rows={4}
                                placeholder="Tell us about yourself..."
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-purple-500 text-white font-medium rounded-lg hover:from-violet-700 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-violet-500/20 flex items-center justify-center gap-2 ${
                                    isSubmitting
                                        ? "opacity-80 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        Save Changes
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right side - Preview */}
                <div className="md:w-80 bg-gradient-to-b from-violet-900/30 to-purple-900/30 p-8 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-white/10">
                    <div className="text-center mb-8">
                        <h3 className="text-xl font-bold text-white mb-2">
                            Profile Preview
                        </h3>
                        <p className="text-white/70">
                            This is how others will see you
                        </p>
                    </div>

                    <div className="w-full max-w-xs bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-violet-400/50">
                                    <img
                                        src={
                                            selectedImage
                                                ? selectedImage
                                                : assets.avatar_icon
                                        }
                                        alt="Profile Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-4 h-4 border-2 border-white/80"></div>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold text-white">
                                    {name || "Your Name"}
                                </h4>
                                <p className="text-sm text-white/70 mt-1">
                                    {bio || "Your bio goes here"}
                                </p>
                            </div>

                            <div className="w-full border-t border-white/10 pt-4">
                                <div className="flex justify-center space-x-4">
                                    <button className="text-white/70 hover:text-violet-400 transition-colors">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                            />
                                        </svg>
                                    </button>
                                    <button className="text-white/70 hover:text-violet-400 transition-colors">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </button>
                                    <button className="text-white/70 hover:text-violet-400 transition-colors">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
