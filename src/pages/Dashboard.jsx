import { useState, useEffect } from "react";
import { 
  FaTractor, FaChartLine, FaArrowRight, FaMapMarkerAlt, 
  FaComments, FaShoppingCart, FaLeaf, FaAppleAlt, 
  FaBox, FaTruck, FaCalendarAlt, FaUsers, FaMedal 
} from "react-icons/fa";

export default function OrangeFarmDashboard() {
    const [selected, setSelected] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Data untuk Orange Farm
    const customers = [
        { name: "Chris Friedly", company: "Supermarket Värnövä", avatar: "CF", revenue: "$45.2K" },
        { name: "Maggie Johnson", company: "Coole Organic Inc.", avatar: "MJ", revenue: "$128.5K" },
        { name: "Gael Harry", company: "New York Finest Fruits", avatar: "GH", revenue: "$67.8K" },
        { name: "Jenna Sullivan", company: "Walnut", avatar: "JS", revenue: "$32.1K" },
    ];

    const deals = [
        { name: "Fruit2Go", progress: 75, amount: "$45K", status: "active" },
        { name: "Marshall's MKT", progress: 60, amount: "$32K", status: "active" },
        { name: "CCNT", progress: 45, amount: "$28K", status: "pending" },
        { name: "Joanna Mini-market", progress: 30, amount: "$18K", status: "pending" },
    ];

    const topStates = [
        { state: "New York", amount: "120K", growth: "+15%" },
        { state: "Massachusetts", amount: "80K", growth: "+12%" },
        { state: "New Hampshire", amount: "70K", growth: "+8%" },
    ];

    const harvestData = [
        { month: "Jan", harvest: 45 },
        { month: "Feb", harvest: 52 },
        { month: "Mar", harvest: 48 },
        { month: "Apr", harvest: 70 },
        { month: "May", harvest: 85 },
        { month: "Jun", harvest: 92 },
        { month: "Jul", harvest: 88 },
        { month: "Aug", harvest: 95 },
        { month: "Sep", harvest: 102 },
        { month: "Oct", harvest: 110 },
        { month: "Nov", harvest: 125 },
        { month: "Dec", harvest: 140 },
    ];

    return (
        <div className={`p-6 bg-slate-50 min-h-screen transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            
            <style>
                {`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-float { animation: float 3s ease-in-out infinite; }
                .animate-slide { animation: slideIn 0.5s ease-out forwards; }
                .glass-card {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }
                `}
            </style>

            {/* Header - Orange Farm */}
            <div className="glass-card p-6 rounded-2xl shadow-xl mb-8 animate-float overflow-hidden relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 rounded-full -mr-20 -mt-20 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-100 rounded-full -ml-16 -mb-16 opacity-30"></div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                            <FaTractor className="text-white text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800">
                                Orange Farm <span className="text-blue-500">🍊</span>
                            </h1>
                            <p className="text-slate-500 text-sm">Manage your farm operations, deals, and harvest analytics</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold text-slate-600">Farm Status: Active</span>
                        </div>
                        <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full">
                            <FaAppleAlt className="text-orange-500 text-sm" />
                            <span className="text-xs font-bold text-orange-600">Harvest Season</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT COLUMN */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Stats Cards Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Total Revenue */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border-l-4 border-blue-500">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Revenue</p>
                                    <h3 className="text-2xl font-black text-slate-800">$284.5K</h3>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <FaChartLine className="text-blue-500" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-green-600 text-sm font-bold">↑ 15%</span>
                                <span className="text-xs text-slate-400">vs last week</span>
                            </div>
                        </div>

                        {/* Total Harvest */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border-l-4 border-orange-500">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Harvest</p>
                                    <h3 className="text-2xl font-black text-slate-800">24.5K kg</h3>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                    <FaLeaf className="text-orange-500" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-green-600 text-sm font-bold">↑ 8%</span>
                                <span className="text-xs text-slate-400">this month</span>
                            </div>
                        </div>

                        {/* Active Deals */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border-l-4 border-emerald-500">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Deals</p>
                                    <h3 className="text-2xl font-black text-slate-800">18</h3>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                    <FaShoppingCart className="text-emerald-500" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-green-600 text-sm font-bold">+4</span>
                                <span className="text-xs text-slate-400">this quarter</span>
                            </div>
                        </div>
                    </div>

                    {/* Harvest Growth Chart */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-700">Harvest Growth</h3>
                            <div className="flex gap-4 text-xs">
                                <span className="text-blue-500 font-bold">📈 Peak: Dec (140K kg)</span>
                                <span className="text-orange-500 font-bold">🏆 Top Buyer: Maggie Johnson</span>
                            </div>
                        </div>
                        <div className="h-48 flex items-end gap-1">
                            {harvestData.map((data, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                                    <div 
                                        className="w-full bg-gradient-to-t from-blue-400 to-blue-500 rounded-t-lg hover:from-blue-500 hover:to-blue-600 transition-all cursor-pointer relative"
                                        style={{ height: `${(data.harvest / 150) * 100}%`, minHeight: '4px' }}
                                    >
                                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {data.harvest} kg
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-medium">{data.month}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
                            <span>📊 Total harvest 2024: 1,052,000 kg</span>
                            <span>🎯 Target 2025: 1,250,000 kg (+18.8%)</span>
                        </div>
                    </div>

                    {/* Quarterly Goal Progress */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-slate-700">Q4 Target Progress</h3>
                            <span className="text-blue-500 text-sm font-black">84%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: '84%' }}></div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-slate-400">
                            <span>Target: 300,000 kg</span>
                            <span>Achieved: 252,000 kg</span>
                            <span>Remaining: 48,000 kg</span>
                        </div>
                    </div>

                    {/* Top Customers */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-700">Top Customers</h3>
                            <button className="text-blue-500 text-xs font-bold hover:text-blue-600 transition-colors">
                                View All →
                            </button>
                        </div>
                        <div className="space-y-3">
                            {customers.map((cust, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                        {cust.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-700 text-sm group-hover:text-blue-600 transition-colors">{cust.name}</p>
                                        <p className="text-xs text-slate-400">{cust.company}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-700">{cust.revenue}</p>
                                        <p className="text-[10px] text-slate-400">revenue</p>
                                    </div>
                                    <FaArrowRight className="text-slate-300 text-xs opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Active Deals Progress */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-700">Active Deals Progress</h3>
                            <span className="text-xs text-slate-400">Closing this quarter</span>
                        </div>
                        <div className="space-y-4">
                            {deals.map((deal, idx) => (
                                <div key={idx} className="group">
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-slate-700 text-sm">{deal.name}</span>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                                deal.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                            }`}>
                                                {deal.status}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-bold text-slate-700">{deal.amount}</span>
                                            <span className="text-xs text-slate-400 ml-2">{deal.progress}%</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${deal.progress}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                            <span className="text-slate-400 text-xs">Total pipeline value: $123K</span>
                            <span className="text-blue-500 text-xs font-bold">Expected close: 78%</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">
                    
                    {/* Top States Performance */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <FaMapMarkerAlt className="text-blue-500" />
                            <h3 className="font-bold text-slate-700">Top Performing States</h3>
                        </div>
                        <div className="space-y-4">
                            {topStates.map((state, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-bold text-slate-700">{state.state}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-500 font-bold">${state.amount}</span>
                                            <span className="text-green-600 text-xs">{state.growth}</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div className="bg-blue-400 h-full rounded-full" style={{ width: `${(parseInt(state.amount) / 150) * 100}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="mt-4 w-full text-center text-blue-500 text-xs font-bold py-2 border-t border-slate-100 hover:text-blue-600 transition-colors">
                            View detailed report →
                        </button>
                    </div>

                    {/* Recent Chats */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                                <FaComments className="text-blue-500" />
                                <h3 className="font-bold text-slate-700">Recent Chats</h3>
                            </div>
                            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">3 new</span>
                        </div>
                        <div className="space-y-3">
                            {[
                                { name: "Alice Wong", message: "When will the oranges arrive?", time: "5m", unread: true, avatar: "AW" },
                                { name: "Mark Davis", message: "Thanks for the samples!", time: "12m", unread: true, avatar: "MD" },
                                { name: "Sarah Lee", message: "Can we get a discount?", time: "1h", unread: false, avatar: "SL" },
                                { name: "John Cooper", message: "Order confirmed", time: "2h", unread: false, avatar: "JC" },
                            ].map((chat, idx) => (
                                <div key={idx} className={`flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-all cursor-pointer ${chat.unread ? 'bg-blue-50/30' : ''}`}>
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white font-bold text-sm">
                                            {chat.avatar}
                                        </div>
                                        {chat.unread && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                            <p className="font-bold text-slate-700 text-sm">{chat.name}</p>
                                            <span className="text-[10px] text-slate-400">{chat.time}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 truncate">{chat.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="mt-4 w-full text-center text-blue-500 text-xs font-bold py-2 border-t border-slate-100 hover:text-blue-600 transition-colors">
                            View all messages →
                        </button>
                    </div>

                    {/* Quick Actions & Info */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <FaTruck className="text-2xl opacity-80" />
                            <div>
                                <p className="text-xs opacity-80">Next scheduled delivery</p>
                                <p className="text-lg font-black">Friday, Dec 20</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <FaCalendarAlt className="text-xl opacity-80" />
                            <div>
                                <p className="text-xs opacity-80">Harvest season ends</p>
                                <p className="text-sm font-bold">December 31, 2024</p>
                            </div>
                        </div>
                        <div className="border-t border-white/20 pt-3 mt-2">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <FaUsers className="opacity-80" />
                                    <span className="text-xs opacity-80">Active farmers</span>
                                </div>
                                <span className="font-bold">24</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <div className="flex items-center gap-2">
                                    <FaMedal className="opacity-80" />
                                    <span className="text-xs opacity-80">Quality rating</span>
                                </div>
                                <span className="font-bold">A+</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Status */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <h3 className="font-bold text-slate-700 mb-3">Today's Deliveries</h3>
                        <div className="space-y-2">
                            {[
                                { customer: "Whole Foods Market", qty: "450 kg", time: "09:00 AM" },
                                { customer: "FreshDirect", qty: "320 kg", time: "10:30 AM" },
                                { customer: "Local Grocery Co", qty: "280 kg", time: "01:00 PM" },
                            ].map((delivery, idx) => (
                                <div key={idx} className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50">
                                    <div>
                                        <p className="font-medium text-slate-700 text-sm">{delivery.customer}</p>
                                        <p className="text-[10px] text-slate-400">{delivery.time}</p>
                                    </div>
                                    <span className="text-xs font-bold text-blue-600">{delivery.qty}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for details */}
            {selected && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl animate-slide">
                        <div className="w-20 h-20 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                            🍊
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2">{selected}</h2>
                        <p className="text-slate-500 mb-8">View detailed information for {selected}</p>
                        <button
                            onClick={() => setSelected(null)}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}