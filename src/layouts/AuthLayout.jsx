import { Outlet } from "react-router-dom"

export default function AuthLayout() {
    return (
        <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
            <div className="w-full max-w-6xl bg-white min-h-[700px] flex shadow-sm">

                {/* LEFT SIDE */}
                <div className="hidden md:flex flex-1 bg-[#f7f7f7]"></div>

                {/* RIGHT SIDE */}
                <div className="w-full md:w-[520px] px-10 py-14 flex flex-col justify-between">

                    <div>
                        {/* LOGO */}
                        <h1 className="text-4xl font-bold text-blue-600 mb-20">
                        </h1>

                        {/* CONTENT */}
                        <Outlet />
                    </div>

                </div>
            </div>
        </div>
    )
}