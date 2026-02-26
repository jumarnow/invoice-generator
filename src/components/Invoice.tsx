import React, { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { EditableText } from './EditableText';
import { InvoiceData, LineItem, AppSettings } from '../types';

interface InvoiceProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
  settings: AppSettings;
  innerRef: React.RefObject<HTMLDivElement>;
}

export function Invoice({ data, onChange, settings, innerRef }: InvoiceProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: keyof InvoiceData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('logo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateField('logo', null);
  };

  const addItem = () => {
    const newItem: LineItem = { id: uuidv4(), description: 'New Item', quantity: 1, rate: 0 };
    updateField('items', [...data.items, newItem]);
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    const newItems = data.items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    updateField('items', newItems);
  };

  const removeItem = (id: string) => {
    updateField('items', data.items.filter(item => item.id !== id));
  };

  // Calculations
  const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  
  const discountAmount = data.discountType === 'percentage' 
    ? subtotal * (data.discount / 100) 
    : data.discount;
    
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (data.tax / 100);
  
  const total = taxableAmount + taxAmount + data.shipping;
  const balanceDue = total - data.amountPaid;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settings.currency,
    }).format(amount);
  };

  return (
    <div 
      ref={innerRef}
      className="bg-white shadow-lg rounded-lg max-w-[800px] mx-auto p-10 hide-on-pdf-shadow"
      style={{ minHeight: '1056px' }} // A4 ratio roughly
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div className="w-1/2">
          {/* Logo Upload */}
          <div 
            className="mb-6 relative group inline-block"
            onClick={() => !data.logo && fileInputRef.current?.click()}
          >
            {data.logo ? (
              <div className="relative">
                <img src={data.logo} alt="Company Logo" className="max-h-24 max-w-xs object-contain" />
                <button 
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="w-48 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors hide-on-pdf">
                <Upload size={24} className="mb-2" />
                <span className="text-sm font-medium">Upload Logo</span>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleLogoUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="space-y-1">
            <EditableText
              value={data.companyName}
              onChange={(val) => updateField('companyName', val)}
              className="text-xl font-bold block"
              placeholder="Your Company Name"
            />
            <EditableText
              value={data.companyDetails}
              onChange={(val) => updateField('companyDetails', val)}
              multiline
              className="text-gray-600 text-sm block"
              placeholder="Your Company Details"
            />
          </div>
        </div>

        <div className="w-1/3 text-right">
          <h1 className="text-4xl font-bold uppercase tracking-wider mb-4" style={{ color: settings.primaryColor }}>
            Invoice
          </h1>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-500 font-medium">Invoice #</div>
            <div className="text-right">
              <EditableText
                value={data.invoiceNumber}
                onChange={(val) => updateField('invoiceNumber', val)}
                className="font-medium"
              />
            </div>
            
            <div className="text-gray-500 font-medium">Date</div>
            <div className="text-right">
              <EditableText
                type="date"
                value={data.date}
                onChange={(val) => updateField('date', val)}
              />
            </div>
            
            <div className="text-gray-500 font-medium">Due Date</div>
            <div className="text-right">
              <EditableText
                type="date"
                value={data.dueDate}
                onChange={(val) => updateField('dueDate', val)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-10">
        <h3 className="text-gray-500 font-bold text-sm uppercase mb-2">Bill To</h3>
        <EditableText
          value={data.billToName}
          onChange={(val) => updateField('billToName', val)}
          className="text-lg font-bold block"
          placeholder="Client Name"
        />
        <EditableText
          value={data.billToDetails}
          onChange={(val) => updateField('billToDetails', val)}
          multiline
          className="text-gray-600 text-sm block mt-1"
          placeholder="Client Address & Details"
        />
      </div>

      {/* Line Items */}
      <div className="mb-8">
        <div className="flex border-b-2 border-gray-800 pb-2 mb-4 text-sm font-bold text-gray-700">
          <div className="flex-grow">Description</div>
          <div className="w-24 text-right">Qty</div>
          <div className="w-32 text-right">Rate</div>
          <div className="w-32 text-right">Amount</div>
          <div className="w-10 hide-on-pdf"></div>
        </div>

        {data.items.map((item) => (
          <div key={item.id} className="flex items-start py-2 border-b border-gray-200 group">
            <div className="flex-grow pr-4">
              <EditableText
                value={item.description}
                onChange={(val) => updateItem(item.id, 'description', val)}
                multiline
                className="w-full"
                placeholder="Item description"
              />
            </div>
            <div className="w-24 text-right">
              <EditableText
                type="number"
                value={item.quantity.toString()}
                onChange={(val) => updateItem(item.id, 'quantity', parseFloat(val) || 0)}
                className="text-right w-full"
              />
            </div>
            <div className="w-32 text-right">
              <EditableText
                type="number"
                value={item.rate.toString()}
                onChange={(val) => updateItem(item.id, 'rate', parseFloat(val) || 0)}
                className="text-right w-full"
              />
            </div>
            <div className="w-32 text-right font-medium pt-1">
              {formatCurrency(item.quantity * item.rate)}
            </div>
            <div className="w-10 text-right hide-on-pdf pt-1">
              <button 
                onClick={() => removeItem(item.id)}
                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        <button 
          onClick={addItem}
          className="mt-4 flex items-center text-sm font-medium hover:text-blue-700 transition-colors hide-on-pdf"
          style={{ color: settings.primaryColor }}
        >
          <Plus size={16} className="mr-1" /> Add Line Item
        </button>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-12">
        <div className="w-1/2 max-w-md">
          <div className="flex justify-between py-2 text-sm">
            <div className="text-gray-600 font-medium">Subtotal</div>
            <div className="font-medium">{formatCurrency(subtotal)}</div>
          </div>

          {settings.showDiscount && (
            <div className="flex justify-between items-center py-2 text-sm border-t border-gray-100">
              <div className="text-gray-600 font-medium flex items-center">
                Discount
                <select 
                  className="ml-2 bg-gray-50 border border-gray-200 rounded text-xs px-1 py-0.5 outline-none hide-on-pdf"
                  value={data.discountType}
                  onChange={(e) => updateField('discountType', e.target.value as 'percentage' | 'flat')}
                >
                  <option value="percentage">%</option>
                  <option value="flat">Flat</option>
                </select>
                <span className="hidden show-on-pdf ml-1">
                  ({data.discountType === 'percentage' ? '%' : 'Flat'})
                </span>
              </div>
              <div className="flex items-center text-right">
                <EditableText
                  type="number"
                  value={data.discount.toString()}
                  onChange={(val) => updateField('discount', parseFloat(val) || 0)}
                  className="w-16 text-right mr-2"
                />
                <span className="text-red-500 font-medium w-24 text-right">
                  -{formatCurrency(discountAmount)}
                </span>
              </div>
            </div>
          )}

          {settings.showTax && (
            <div className="flex justify-between items-center py-2 text-sm border-t border-gray-100">
              <div className="text-gray-600 font-medium flex items-center">
                Tax (%)
              </div>
              <div className="flex items-center text-right">
                <EditableText
                  type="number"
                  value={data.tax.toString()}
                  onChange={(val) => updateField('tax', parseFloat(val) || 0)}
                  className="w-16 text-right mr-2"
                />
                <span className="font-medium w-24 text-right">
                  {formatCurrency(taxAmount)}
                </span>
              </div>
            </div>
          )}

          {settings.showShipping && (
            <div className="flex justify-between items-center py-2 text-sm border-t border-gray-100">
              <div className="text-gray-600 font-medium">Shipping</div>
              <div className="flex items-center text-right">
                <EditableText
                  type="number"
                  value={data.shipping.toString()}
                  onChange={(val) => updateField('shipping', parseFloat(val) || 0)}
                  className="w-24 text-right font-medium"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between py-3 text-lg font-bold border-t-2 border-gray-800 mt-2">
            <div>Total</div>
            <div>{formatCurrency(total)}</div>
          </div>

          <div className="flex justify-between items-center py-2 text-sm border-t border-gray-100">
            <div className="text-gray-600 font-medium">Amount Paid</div>
            <div className="flex items-center text-right">
              <EditableText
                type="number"
                value={data.amountPaid.toString()}
                onChange={(val) => updateField('amountPaid', parseFloat(val) || 0)}
                className="w-24 text-right font-medium text-green-600"
              />
            </div>
          </div>

          <div className="flex justify-between py-3 text-lg font-bold bg-gray-50 px-4 rounded-lg mt-2" style={{ color: settings.primaryColor }}>
            <div>Balance Due</div>
            <div>{formatCurrency(balanceDue)}</div>
          </div>
        </div>
      </div>

      {/* Footer Notes */}
      <div className="grid grid-cols-2 gap-8 text-sm">
        <div>
          <h3 className="text-gray-500 font-bold uppercase mb-1">Notes</h3>
          <EditableText
            value={data.notes}
            onChange={(val) => updateField('notes', val)}
            multiline
            className="text-gray-600 block"
            placeholder="Additional notes..."
          />
        </div>
        <div>
          <h3 className="text-gray-500 font-bold uppercase mb-1">Terms</h3>
          <EditableText
            value={data.terms}
            onChange={(val) => updateField('terms', val)}
            multiline
            className="text-gray-600 block"
            placeholder="Payment terms..."
          />
        </div>
      </div>
    </div>
  );
}
