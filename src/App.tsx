import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Invoice } from './components/Invoice';
import { Sidebar } from './components/Sidebar';
import { useLocalStorage } from './hooks/useLocalStorage';
import { defaultInvoiceData, defaultSettings, InvoiceData, AppSettings } from './types';

export default function App() {
  const [invoiceData, setInvoiceData] = useLocalStorage<InvoiceData>('invoiceData', defaultInvoiceData);
  const [settings, setSettings] = useLocalStorage<AppSettings>('invoiceSettings', defaultSettings);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current || isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      // Add a class to hide elements during PDF generation
      invoiceRef.current.classList.add('pdf-generating');
      
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      
      invoiceRef.current.classList.remove('pdf-generating');

      const imgData = canvas.toDataURL('image/png');
      
      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
      pdf.save(`${invoiceData.invoiceNumber || 'invoice'}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Invoice ${invoiceData.invoiceNumber} from ${invoiceData.companyName}`);
    const body = encodeURIComponent(`Hi ${invoiceData.billToName},\n\nPlease find the details for invoice ${invoiceData.invoiceNumber} attached.\n\nThank you,\n${invoiceData.companyName}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans text-gray-900">
      {/* Main Content Area */}
      <div className="flex-grow pr-80 py-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4">
          <Invoice 
            data={invoiceData} 
            onChange={setInvoiceData} 
            settings={settings}
            innerRef={invoiceRef}
          />
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar 
        settings={settings} 
        onChange={setSettings} 
        onDownload={handleDownloadPDF}
        onEmail={handleEmail}
      />
      
      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" style={{ borderTopColor: 'transparent', borderRightColor: settings.primaryColor, borderBottomColor: settings.primaryColor, borderLeftColor: settings.primaryColor }}></div>
            <p className="text-lg font-medium">Generating PDF...</p>
          </div>
        </div>
      )}
    </div>
  );
}
