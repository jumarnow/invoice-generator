import React from 'react';
import { Download, Mail, Settings, Palette, DollarSign, Calendar, Eye } from 'lucide-react';
import { AppSettings } from '../types';

interface SidebarProps {
  settings: AppSettings;
  onChange: (settings: AppSettings) => void;
  onDownload: () => void;
  onEmail: () => void;
}

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

const colors = [
  '#3b82f6', // blue-500
  '#ef4444', // red-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#64748b', // slate-500
  '#000000', // black
];

export function Sidebar({ settings, onChange, onDownload, onEmail }: SidebarProps) {
  const updateSetting = (field: keyof AppSettings, value: any) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-screen overflow-y-auto flex flex-col shadow-xl z-10 fixed right-0 top-0 print:hidden">
      <div className="p-6 flex-grow">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <Settings className="mr-2" size={20} />
          Customize
        </h2>

        {/* Actions */}
        <div className="space-y-3 mb-8">
          <button
            onClick={onDownload}
            className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
            style={{ backgroundColor: settings.primaryColor }}
          >
            <Download className="mr-2" size={18} />
            Download PDF
          </button>
          
          <button
            onClick={onEmail}
            className="w-full flex items-center justify-center py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Mail className="mr-2" size={18} />
            Send via Email
          </button>
        </div>

        <div className="space-y-6">
          {/* Currency */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="mr-2" size={16} />
              Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) => updateSetting('currency', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Primary Color */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Palette className="mr-2" size={16} />
              Primary Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => updateSetting('primaryColor', color)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    settings.primaryColor === color ? 'border-gray-800 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Toggle Columns */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
              <Eye className="mr-2" size={16} />
              Show / Hide Fields
            </label>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={settings.showDiscount}
                    onChange={(e) => updateSetting('showDiscount', e.target.checked)}
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${settings.showDiscount ? 'bg-blue-500' : 'bg-gray-300'}`} style={{ backgroundColor: settings.showDiscount ? settings.primaryColor : undefined }}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.showDiscount ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <div className="ml-3 text-sm text-gray-700 font-medium">Discount</div>
              </label>

              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={settings.showTax}
                    onChange={(e) => updateSetting('showTax', e.target.checked)}
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${settings.showTax ? 'bg-blue-500' : 'bg-gray-300'}`} style={{ backgroundColor: settings.showTax ? settings.primaryColor : undefined }}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.showTax ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <div className="ml-3 text-sm text-gray-700 font-medium">Tax</div>
              </label>

              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={settings.showShipping}
                    onChange={(e) => updateSetting('showShipping', e.target.checked)}
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${settings.showShipping ? 'bg-blue-500' : 'bg-gray-300'}`} style={{ backgroundColor: settings.showShipping ? settings.primaryColor : undefined }}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.showShipping ? 'transform translate-x-4' : ''}`}></div>
                </div>
                <div className="ml-3 text-sm text-gray-700 font-medium">Shipping</div>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-gray-50 text-xs text-center text-gray-500">
        Data is saved automatically to your browser.
      </div>
    </div>
  );
}
