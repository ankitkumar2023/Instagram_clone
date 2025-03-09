import React, { useState } from 'react';
import Label from './ui/Label';
import Input from './ui/Input';
import Button from './ui/Button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Signup = () => {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const changeEventHandler = (e) => {
        setInput((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        console.log("Input Data:", input);
        
        try {
            setLoading(true);
            const response = await axios.post(
              "http://localhost:8000/api/v1/user/register",
              input,
              {
                headers: {
                  // ✅ Corrected "header" to "headers"
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              }
            );

            if (response.data.success) {
                navigate('/login');
                toast.success(response.data.message);
                setInput({ username: "", email: "", password: "" });
            }
        } catch (error) {
            console.log("Error during signup:", error);
            toast.error(error.response?.data?.message || "Signup failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center w-screen h-[80vh] mt-10 justify-center">
            <form onSubmit={handleSignupSubmit} className="shadow-lg flex flex-col gap-5 p-8 w-[350px] bg-white rounded-md">
                <div className="my-4 text-center">
                    <h1 className="font-bold text-xl">LOGO</h1>
                    <p className="text-sm">Signup to see photos & videos from your friends</p>
                </div>

                <div>
                    <label className="text-[15px] font-bold">Username</label>
                    <Input
                        type="text"
                        name="username"
                        value={input.username}
                        onChange={changeEventHandler}
                        placeholder="Enter your username"
                        className="focus-visible:ring-transparent"
                        autoComplete="username"
                    />
                </div>

                <div>
                    <label className="text-[15px] font-bold">Email</label>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        placeholder="Enter your email"
                        className="focus-visible:ring-transparent"
                        autoComplete="email"
                    />
                </div>

                <div>
                    <label className="text-[15px] font-bold">Password</label>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        placeholder="Enter your password"
                        className="focus-visible:ring-transparent"
                        autoComplete="current-password"
                    />
                </div>

                {loading ? (
                    <button
                        disabled
                        className="flex justify-center items-center gap-2 w-full h-[45px] bg-gray-500 text-white rounded-md cursor-not-allowed"
                    >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Please Wait...
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="mt-4 w-full h-[45px] bg-[#2A3335] text-white rounded-md hover:bg-[#1f2829] transition"
                    >
                        Signup
                    </button>
                )}

                <span className="text-center text-sm mt-2">
                    Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Login</Link>
                </span>
            </form>
        </div>
    );
};

export default Signup;
