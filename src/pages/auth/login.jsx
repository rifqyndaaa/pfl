import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ImSpinner2 } from "react-icons/im"

export default function Login() {
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [dataForm, setDataForm] = useState({
        email: "",
        password: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target

        setDataForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)
        setError("")

        axios
            .post("https://dummyjson.com/user/login", {
                username: dataForm.email,
                password: dataForm.password,
            })
            .then((response) => {
                if (response.status === 200) {
                    navigate("/")
                }
            })
            .catch((err) => {
                setError(
                    err?.response?.data?.message ||
                    "Login gagal"
                )
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <div>

            {/* LOGO */}
            <h1 className="text-5xl font-bold text-blue-600 mb-20">
                BUTIQ
            </h1>

            {/* TITLE */}
            <h1 className="text-[48px] leading-tight font-bold text-blue-600 mb-6">
                Smart Fashion Management For Modern Boutique Business
            </h1>

            {/* SUBTITLE */}
            <p className="text-gray-500 mb-10 text-lg">
                Welcome back! Please login to your BUTIQ account.
            </p>

            {/* ERROR */}
            {error && (
                <div className="mb-5 bg-red-50 border border-red-200 text-red-500 p-3 text-sm">
                    {error}
                </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit}>

                {/* EMAIL */}
                <div className="border border-gray-300 border-b-0">
                    <input
                        type="text"
                        name="email"
                        onChange={handleChange}
                        placeholder="Email Address"
                        className="w-full px-5 py-4 outline-none"
                    />
                </div>

                {/* PASSWORD */}
                <div className="border border-gray-300">
                    <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full px-5 py-4 outline-none"
                    />
                </div>

                {/* OPTIONS */}
                <div className="flex items-center justify-between mt-5 mb-10 text-gray-500 text-sm">

                    <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        Remember Me
                    </label>

                    <button
                        type="button"
                        className="hover:text-blue-600 transition"
                    >
                        Forgot Password?
                    </button>

                </div>

                {/* BUTTON */}
                <div className="flex gap-5 mb-16">

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 transition"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <ImSpinner2 className="animate-spin mr-2" />
                                Loading...
                            </span>
                        ) : (
                            "Login"
                        )}
                    </button>

                    <button
                        type="button"
                        className="border border-blue-500 text-blue-600 px-10 py-4 hover:bg-blue-50 transition"
                    >
                        Sign Up
                    </button>

                </div>

                {/* SOCIAL LOGIN */}
                <div className="flex items-center justify-between text-sm">

                    <span className="text-gray-500">
                        Or login with
                    </span>

                    <button
                        type="button"
                        className="text-blue-600 font-semibold"
                    >
                        Facebook
                    </button>

                    <button
                        type="button"
                        className="text-blue-600 font-semibold"
                    >
                        LinkedIn
                    </button>

                    <button
                        type="button"
                        className="text-blue-600 font-semibold"
                    >
                        Google
                    </button>

                </div>

            </form>
        </div>
    )
}