const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/NewSalePage.tsx', 'utf8');

code = code.replace(
  "const matched = products.find(p => p.sku === decodedText);",
  "db.products.where('sku').equals(decodedText).first().then((matched) => {"
);
code = code.replace(
  "setShowScanner(false);\n            db.products.where",
  "setShowScanner(false);\n            db.products.where"
);
code = code.replace(
  "alert(`No product found for barcode: ${decodedText}`);\n            }",
  "alert(`No product found for barcode: ${decodedText}`);\n            }\n          });"
);

fs.writeFileSync('src/pages/dashboard/NewSalePage.tsx', code);
