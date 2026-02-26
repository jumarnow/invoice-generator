export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface InvoiceData {
  logo: string | null;
  companyName: string;
  companyDetails: string;
  billToName: string;
  billToDetails: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  notes: string;
  terms: string;
  items: LineItem[];
  discount: number;
  discountType: 'percentage' | 'flat';
  tax: number;
  shipping: number;
  amountPaid: number;
}

export interface AppSettings {
  currency: string;
  dateFormat: string;
  primaryColor: string;
  showDiscount: boolean;
  showTax: boolean;
  showShipping: boolean;
}

export const defaultInvoiceData: InvoiceData = {
  logo: null,
  companyName: 'Your Company',
  companyDetails: '123 Business Rd.\nCity, State 12345\nhello@yourcompany.com',
  billToName: 'Client Name',
  billToDetails: '456 Client St.\nCity, State 67890\nclient@example.com',
  invoiceNumber: 'INV-001',
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  notes: 'Thank you for your business!',
  terms: 'Please pay within 14 days.',
  items: [
    { id: '1', description: 'Web Design Services', quantity: 1, rate: 1000 },
    { id: '2', description: 'Hosting (1 Year)', quantity: 1, rate: 150 }
  ],
  discount: 0,
  discountType: 'percentage',
  tax: 0,
  shipping: 0,
  amountPaid: 0
};

export const defaultSettings: AppSettings = {
  currency: 'USD',
  dateFormat: 'MMM dd, yyyy',
  primaryColor: '#3b82f6', // blue-500
  showDiscount: false,
  showTax: true,
  showShipping: false
};
