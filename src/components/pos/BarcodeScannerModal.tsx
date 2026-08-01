import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X } from 'lucide-react';
import { Card } from '../ui/Card';

interface BarcodeScannerModalProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

export default function BarcodeScannerModal({ onScan, onClose }: BarcodeScannerModalProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");
    
    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      },
      (decodedText) => {
        html5QrCode.stop().then(() => {
          onScan(decodedText);
        }).catch(err => {
          console.error(err);
          onScan(decodedText);
        });
      },
      (errorMessage) => {
        // Ignored
      }
    ).catch((err) => {
      console.error(err);
      setError("Could not start camera. Please ensure you have given camera permissions.");
    });

    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <Card className="w-full max-w-sm bg-[var(--color-surface)] relative max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-[var(--color-muted)]/10">
          <h3 className="font-semibold text-lg">Scan Barcode</h3>
          <button onClick={onClose} className="text-[var(--color-muted)] hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4 flex-1">
          {error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : (
            <div id="reader" className="w-full h-full text-black bg-white rounded-lg overflow-hidden"></div>
          )}
          <p className="text-sm text-center text-[var(--color-muted)] mt-4">
            Point camera at product barcode
          </p>
        </div>
      </Card>
    </div>
  );
}
