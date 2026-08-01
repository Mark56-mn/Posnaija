const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/ProductsPage.tsx', 'utf8');

const target = `<Input value={formData.sku}  onChange={e => setFormData({...formData, sku: e.target.value})} placeholder="Scan or type barcode" />`;
const replacement = `<div className="relative">
                    <Input value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} placeholder="Scan or type barcode" className="pr-10" />
                    <button type="button" onClick={() => { setShowScanner(true); setScanningForSku(true); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[var(--color-muted)] hover:text-[var(--color-accent)]">
                      <ScanLine className="h-4 w-4" />
                    </button>
                  </div>`;

code = code.replace(target, replacement);

const target2 = `              onChange={e => setSearch(e.target.value)}
              className="pl-10 h-10 w-full sm:w-64"
            />`;
const replacement2 = `              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-10 h-10 w-full sm:w-64"
            />
            <button onClick={() => { setShowScanner(true); setScanningForSku(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--color-muted)] hover:text-[var(--color-accent)]">
              <ScanLine className="h-4 w-4" />
            </button>`;

code = code.replace(target2, replacement2);

fs.writeFileSync('src/pages/dashboard/ProductsPage.tsx', code);
