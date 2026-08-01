const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/ProductsPage.tsx', 'utf8');

const target = `    </div>
  );
}`;
const replacement = `      {showScanner && (
        <BarcodeScannerModal
          onScan={(decodedText) => {
            if (scanningForSku) {
              setFormData(prev => ({ ...prev, sku: decodedText }));
              setScanningForSku(false);
            } else {
              setSearch(decodedText);
            }
            setShowScanner(false);
          }}
          onClose={() => {
            setShowScanner(false);
            setScanningForSku(false);
          }}
        />
      )}
    </div>
  );
}`;

code = code.replace(target, replacement);

fs.writeFileSync('src/pages/dashboard/ProductsPage.tsx', code);
