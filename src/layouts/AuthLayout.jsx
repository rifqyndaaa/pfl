import { Outlet } from "react-router-dom"

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">

            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-blue-100">

                {/* BRAND */}
                <div className="flex items-center justify-center mb-6">
                    <h1 className="text-4xl font-extrabold text-blue-600 tracking-wide">
                        BUIQ
                    </h1>
                </div>

                {/* CHILD ROUTE */}
                <Outlet />

                {/* FOOTER */}
                <p className="text-center text-sm text-gray-400 mt-6">
                    © {new Date().getFullYear()} BUIQ - Business System. All rights reserved.
                </p>

            </div>
        </div>
    )
}