import React, { useState, useEffect, useContext } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/authContext";

const LoginPage = () => {
    const [curState, setCurState] = useState("Sign Up");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [bio, setBio] = useState("");
    const [isDataSubmitted, setIsDataSubmitted] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const { login } = useContext(AuthContext);
    const submitHandler = (e) => {
        e.preventDefault();
        if (curState === "Sign Up" && !isDataSubmitted) {
            setIsAnimating(true);
            setTimeout(() => {
                setIsDataSubmitted(true);
                setIsAnimating(false);
            }, 500);
            return;
        }
        // Handle form submission logic here
        login(curState === "Sign Up" ? "signup" : "login", {
            fullName,
            email,
            password,
            bio,
        });
    };

    const toggleAuthState = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setCurState(curState === "Sign Up" ? "Login" : "Sign Up");
            setIsDataSubmitted(false);
            setIsAnimating(false);
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex items-center justify-center p-4">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white/10"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 300 + 100}px`,
                            height: `${Math.random() * 300 + 100}px`,
                            transform: `translate(-50%, -50%)`,
                            opacity: 0.1 + Math.random() * 0.2,
                        }}
                    />
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
                {/* Left section - Branding */}
                <div
                    className={`transition-all duration-500 ${
                        isAnimating
                            ? "opacity-0 translate-y-4"
                            : "opacity-100 translate-y-0"
                    } flex flex-col items-center text-center lg:text-left lg:items-start`}
                >
                    <div className="relative">
                        <img
                            src={assets.logo}
                            alt="logo"
                            className="w-24 h-24 lg:w-32 lg:h-32 mb-6 mx-auto lg:mx-0"
                        />
                        <div className="absolute -inset-4 bg-violet-500/20 rounded-full blur-lg -z-10" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
                        CHATTR
                    </h1>
                    <p className="text-lg text-white/80 max-w-md">
                        Connect with friends and the world around you with our
                        modern chat platform.
                    </p>
                    <div className="mt-8 hidden lg:flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-white"
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
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-white"
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
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Right section - Form */}
                <div
                    className={`transition-all duration-500 ${
                        isAnimating
                            ? "opacity-0 scale-95"
                            : "opacity-100 scale-100"
                    } w-full max-w-md`}
                >
                    <form
                        onSubmit={submitHandler}
                        className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-white">
                                {curState === "Sign Up"
                                    ? isDataSubmitted
                                        ? "Tell us about yourself"
                                        : "Create Account"
                                    : "Welcome Back"}
                            </h2>
                            {isDataSubmitted && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAnimating(true);
                                        setTimeout(() => {
                                            setIsDataSubmitted(false);
                                            setIsAnimating(false);
                                        }, 500);
                                    }}
                                    className="text-white/60 hover:text-white transition-colors"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                        />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {curState === "Sign Up" && !isDataSubmitted && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-white/70 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    onChange={(e) =>
                                        setFullName(e.target.value)
                                    }
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        )}

                        {!isDataSubmitted && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-white/70 mb-1">
                                        Email
                                    </label>
                                    <input
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        type="email"
                                        placeholder="your@email.com"
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-white/70 mb-1">
                                        Password
                                    </label>
                                    <input
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </>
                        )}

                        {curState === "Sign Up" && isDataSubmitted && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-white/70 mb-1">
                                    Bio (Optional)
                                </label>
                                <textarea
                                    onChange={(e) => setBio(e.target.value)}
                                    value={bio}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    placeholder="A short introduction about yourself..."
                                ></textarea>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-purple-500 text-white font-medium rounded-lg hover:from-violet-700 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-violet-500/20 mb-6 flex items-center justify-center gap-2"
                        >
                            {curState === "Sign Up"
                                ? isDataSubmitted
                                    ? "Complete Registration"
                                    : "Continue"
                                : "Login"}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>

                        <div className="flex items-center mb-6">
                            <input
                                id="terms"
                                type="checkbox"
                                className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-white/20 rounded bg-white/5"
                                required
                            />
                            <label
                                htmlFor="terms"
                                className="ml-2 block text-sm text-white/70"
                            >
                                I agree to the{" "}
                                <a
                                    href="#"
                                    className="text-violet-400 hover:underline"
                                >
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a
                                    href="#"
                                    className="text-violet-400 hover:underline"
                                >
                                    Privacy Policy
                                </a>
                            </label>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-white/70">
                                {curState === "Sign Up"
                                    ? "Already have an account?"
                                    : "Don't have an account?"}{" "}
                                <button
                                    type="button"
                                    onClick={toggleAuthState}
                                    className="font-medium text-violet-400 hover:text-violet-300 transition-colors"
                                >
                                    {curState === "Sign Up"
                                        ? "Login"
                                        : "Sign Up"}
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
