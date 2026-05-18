import { DollarSign, TrendingUp, CreditCard, DownloadCloud } from "lucide-react";

export default function RevenuePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Revenue & Subscriptions</h2>
        <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
          <DownloadCloud size={18} /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-50 rounded-full text-green-600"><DollarSign size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Monthly Recurring Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$1,245,000</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-green-600 font-medium">
            <TrendingUp size={16} className="mr-1" /> +12.5% from last month
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-full text-blue-600"><CreditCard size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900">84,392</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-green-600 font-medium">
            <TrendingUp size={16} className="mr-1" /> +4.2% from last month
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-50 rounded-full text-purple-600"><DollarSign size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Ad Revenue (MTD)</p>
              <p className="text-2xl font-bold text-gray-900">$342,800</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-green-600 font-medium">
            <TrendingUp size={16} className="mr-1" /> +8.1% from last month
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 min-h-[400px]">
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Revenue History</h3>
        <div className="w-full h-64 bg-gray-50 rounded-md border border-dashed border-gray-200 flex items-center justify-center text-gray-400">
          [Interactive Financial Chart Placeholder]
        </div>
      </div>
    </div>
  );
}
