import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import apiService from "../../logic/apiService";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { showToast } from "../../app/redux-reducers/contextProvider";

export default function Login() {
    const dispatch = useDispatch();

    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const navigate = useNavigate();

    // Authenticate user
    function handleSubmit(e) {
        e.preventDefault();

        if (!credentials.email || !credentials.password) {
            dispatch(
                showToast({
                    message: "Fill in all fields",
                    level: 2,
                }),
            );
            return;
        }

        apiService.post("/auth", credentials).then((res) => {
            if (res.success) {
                dispatch(
                    showToast({
                        message: "Succesfully logged in",
                        level: 1,
                    }),
                );
                navigate("/feed");
            } else {
                dispatch(
                    showToast({
                        message:
                            "Login failed. \nError: " +
                            res.message.toLowerCase().replace(/_/g, " "),
                        level: 2,
                    }),
                );
            }
        });
    }

    // Update credentials state when input changes
    function onChange(e) {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
    }

    return (
        <div className="bg-dark-bg text-dark-text flex min-h-dvh flex-col items-center justify-center">
            <h1 className="pattaya my-6 text-3xl font-bold">Meer of Minder</h1>

            <form onSubmit={handleSubmit}>
                <div className="flex w-full flex-col items-center justify-center gap-3">
                    <input
                        className="focus:border-dark-secondary bg-dark-bg border-dark-primary h-12 w-72 rounded border p-2 outline-none"
                        name="email"
                        value={credentials.email}
                        onChange={onChange}
                        placeholder="Email"
                        type="email"
                    />
                    <div className="relative w-72">
                        <input
                            className="focus:border-dark-secondary bg-dark-bg border-dark-primary h-12 w-full rounded border p-2 pr-10 outline-none"
                            name="password"
                            value={credentials.password}
                            onChange={onChange}
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 flex -translate-y-1/2 transform items-center"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex="-1"
                        >
                            <span className="border-dark-secondary flex items-center border-l-2 pl-2">
                                {showPassword ? (
                                    <FaEyeSlash className="text-dark-secondary" />
                                ) : (
                                    <FaEye className="text-dark-secondary" />
                                )}
                            </span>
                        </button>
                    </div>
                </div>
                <div className="flex h-min w-full items-center justify-end py-5">
                    {/* <Link className="text-dark-accent text-sm hover:underline">
                        Forgot password?
                    </Link> */}
                </div>
                <div className="flex w-72 flex-col items-center justify-center gap-3">
                    <button
                        type="submit"
                        className="bg-dark-secondary text-dark-text h-12 w-full rounded font-bold"
                    >
                        Login
                    </button>
                    <div className="flex w-full items-center justify-center">
                        <span className="bg-dark-primary h-px flex-grow" />
                        <span className="mx-4 -translate-y-px">or</span>
                        <span className="bg-dark-primary h-px flex-grow" />
                    </div>
                    <Link
                        to={"/auth/signup"}
                        className="border-dark-secondary text-dark-secondary flex h-12 w-full items-center justify-center rounded border font-bold"
                    >
                        Register
                    </Link>
                </div>
            </form>
        </div>
    );
}
