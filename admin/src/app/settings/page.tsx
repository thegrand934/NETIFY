import { Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Platform Settings</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">General Configuration</h3>
          <p className="text-sm text-gray-500">Manage basic settings for the NETIFY platform.</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Platform Name</label>
              <input type="text" defaultValue="NETIFY" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Support Email</label>
              <input type="email" defaultValue="support@netify.com" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Maintenance Mode</label>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm border border-gray-300"></div>
              </div>
              <span className="text-sm text-gray-600">Platform is currently active and accepting users.</span>
            </div>
          </div>
          
          <hr className="border-gray-200" />

          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-4">Subscription Pricing (USD)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Basic Tier</label>
                <input type="number" defaultValue="8.99" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Standard Tier</label>
                <input type="number" defaultValue="14.99" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Premium (4K) Tier</label>
                <input type="number" defaultValue="19.99" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium flex items-center gap-2 transition-colors">
            <Save size={18} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
