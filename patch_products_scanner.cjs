const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/ProductsPage.tsx', 'utf8');

// Add imports
code = code.replace(
  "import { Search, Plus, Upload, MoreHorizontal, Pencil, Trash2, ShieldAlert, FileText, Settings2, PackagePlus, PackageMinus } from 'lucide-react';",
  "import { Search, Plus, Upload, MoreHorizontal, Pencil, Trash2, ShieldAlert, FileText, Settings2, PackagePlus, PackageMinus, Camera, X } from 'lucide-react';\nimport { Html5QrcodeScanner } from 'html5-qrcode';"
);

// Add scanner state
code = code.replace(
  "const [searchTerm, setSearchTerm] = useState('');",
  "const [searchTerm, setSearchTerm] = useState('');\n  const [showScanner, setShowScanner] = useState(false);\n  const [scanningForSku, setScanningForSku] = useState(false);"
);

// Add scanner effect
const scannerEffect = `
  useEffect(() => {
    if (!showScanner && !scanningForSku) return;
    
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: {width: 250, height: 250}, aspectRatio: 1.0 },
      false
    );
    
    scanner.render(
      (decodedText) => {
        if (scanningForSku) {
           setFormData(prev => ({ ...prev, sku: decodedText }));
           setScanningForSku(false);
        } else {
           setSearchTerm(decodedText);
           setShowScanner(false);
        }
        scanner.clear();
      },
      (errorMessage) => {}
    );
    
    return () => {
      scanner.clear().catch(console.error);
    };
  }, [showScanner, scanningForSku]);
`;

code = code.replace(
  "useEffect(() => {\n    loadData();",
  scannerEffect + "\n  useEffect(() => {\n    loadData();"
);

// Add scanner button next to search
const searchBarRegex = /<div className="relative w-full md:w-64">[\s\S]*?<\/div>/;
const newSearchBar = `
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted)]" />
              <Input 
                placeholder="Search products..." 
                className="pl-9 h-10 bg-[var(--color-surface)] border-[var(--color-muted)]/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-10 w-10 p-0 shrink-0 border-[var(--color-muted)]/20 bg-[var(--color-surface)]" onClick={() => setShowScanner(true)}>
              <Camera className="h-5 w-5" />
            </Button>
          </div>
`;

code = code.replace(searchBarRegex, newSearchBar);

// Add scanner button next to SKU in form
const skuInputRegex = /<Input value=\{formData.sku\} onChange=\{e => setFormData\(\{\.\.\.formData, sku: e\.target\.value\}\)\} \/>/;
const newSkuInput = `
                  <div className="flex gap-2">
                    <Input className="flex-1" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
                    <Button type="button" variant="outline" onClick={() => setScanningForSku(true)} className="px-3">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
`;
code = code.replace(skuInputRegex, newSkuInput);

// Add scanner modal
const scannerModal = `
      {/* Scanner Modal */}
      {(showScanner || scanningForSku) && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--color-background)] rounded-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[var(--color-muted)]/10 flex justify-between items-center">
              <h2 className="text-xl font-bold">Scan Barcode / QR Code</h2>
              <button onClick={() => { setShowScanner(false); setScanningForSku(false); }} className="p-2 hover:bg-[var(--color-surface)] rounded-full transition-colors">
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
  "{/* Form Modal */}",
  scannerModal + "\n      {/* Form Modal */}"
);

fs.writeFileSync('src/pages/dashboard/ProductsPage.tsx', code);
