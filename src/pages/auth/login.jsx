import axios from "axios"
import { useState } from "react"
import { BsFillExclamationDiamondFill } from "react-icons/bs"
import { ImSpinner2 } from "react-icons/im"
import { useNavigate } from "react-router-dom"

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
                } else {
                    setError(response.data.message || "Login gagal")
                }
            })
            .catch((err) => {
                setError(
                    err?.response?.data?.message ||
                    err.message ||
                    "Terjadi kesalahan"
                )
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <div className="w-full">

            {/* TITLE */}
            <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">
                Login BUIQ
            </h2>

            {/* ERROR */}
            {error && (
                <div className="bg-red-50 border border-red-200 mb-5 p-3 text-sm text-red-600 rounded-lg flex items-center">
                    <BsFillExclamationDiamondFill className="text-red-500 mr-2 text-lg" />
                    {error}
                </div>
            )}

            {/* LOADING */}
            {loading && (
                <div className="bg-blue-50 border border-blue-200 mb-5 p-3 text-sm rounded-lg flex items-center text-blue-600">
                    <ImSpinner2 className="mr-2 animate-spin" />
                    Mohon Tunggu BUIQ...
                </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">

                {/* EMAIL */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Email BUIQ
                    </label>
                    <input
                        name="email"
                        onChange={handleChange}
                        type="text"
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl
                        focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* PASSWORD */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Password BUIQ
                    </label>
                    <input
                        name="password"
                        onChange={handleChange}
                        type="password"
                        placeholder="********"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl
                        focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* BUTTON */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold
                    py-3 rounded-xl flex items-center justify-center transition"
                >
                    {loading ? (
                        <>
                            <ImSpinner2 className="animate-spin mr-2" />
                            Loading...
                        </>
                    ) : (
                        "Login BUIQ"
                    )}
                </button>

            </form>
        </div>
    )
}