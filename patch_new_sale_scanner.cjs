const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/NewSalePage.tsx', 'utf8');

// Add imports
code = code.replace(
  "import { Search, ShoppingCart, Plus, Minus, Trash2, UserPlus, FileText, Check } from 'lucide-react';",
  "import { Search, ShoppingCart, Plus, Minus, Trash2, UserPlus, FileText, Check, Camera, X } from 'lucide-react';\nimport { Html5QrcodeScanner } from 'html5-qrcode';"
);

// Add scanner state
code = code.replace(
  "const [receiptNum, setReceiptNum] = useState('');",
  "const [receiptNum, setReceiptNum] = useState('');\n  const [showScanner, setShowScanner] = useState(false);"
);

// Add scanner effect
const scannerEffect = `
  useEffect(() => {
    if (!showScanner) return;
    
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: {width: 250, height: 250}, aspectRatio: 1.0 },
      false
    );
    
    scanner.render(
      (decodedText) => {
        // Success callback
        setSearchTerm(decodedText);
        setShowScanner(false);
        scanner.clear();
      },
      (errorMessage) => {
        // Error callback (ignore)
      }
    );
    
    return () => {
      scanner.clear().catch(console.error);
    };
  }, [showScanner]);
`;

code = code.replace(
  "useEffect(() => {\n    // Filter products",
  scannerEffect + "\n  useEffect(() => {\n    // Filter products"
);

// Add scanner button next to search
const searchBar = `
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-muted)]" />
            <Input 
              placeholder="Search products by name or SKU..." 
              className="pl-10 h-12 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
`;
const newSearchBar = `
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-muted)]" />
              <Input 
                placeholder="Search products by name or SKU..." 
                className="pl-10 h-12 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-12 w-12 p-0 shrink-0" onClick={() => setShowScanner(true)}>
              <Camera className="h-6 w-6" />
            </Button>
          </div>
`;

code = code.replace(
  / <div className="relative mb-6">[\s\S]*?<\/div>/,
  newSearchBar
);

// Add scanner modal
const scannerModal = `
      {/* Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--color-background)] rounded-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[var(--color-muted)]/10 flex justify-between items-center">
              <h2 className="text-xl font-bold">Scan Barcode / QR Code</h2>
              <button onClick={() => setShowScanner(false)} className="p-2 hover:bg-[var(--color-surface)] rounded-full transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 bg-white" style={{ minHeight: '300px' }}>
              <div id="reader" className="w-full text-black"></div>
            </div>
          </div>
        </div>
      )}
`;

code = code.replace(
  "{/* Main Content - Products Grid */}",
  scannerModal + "\n      {/* Main Content - Products Grid */}"
);

fs.writeFileSync('src/pages/dashboard/NewSalePage.tsx', code);
