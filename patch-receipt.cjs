const fs = require('fs');
let code = fs.readFileSync('src/components/pos/ReceiptModal.tsx', 'utf8');

const importTarget = `import { QRCodeSVG } from 'qrcode.react';`;
const importReplacement = `import { QRCodeSVG } from 'qrcode.react';\nimport { useEffect } from 'react';`;

if (code.includes(importTarget)) {
  code = code.replace(importTarget, importReplacement);
}

const componentStartTarget = `export default function ReceiptModal({ sale, session, onClose }: any) {
  if (!sale) return null;`;
const componentStartReplacement = `export default function ReceiptModal({ sale, session, onClose }: any) {
  useEffect(() => {
    if (localStorage.getItem('autoPrint') === 'true' && sale) {
      setTimeout(() => window.print(), 500);
    }
  }, [sale]);

  if (!sale) return null;`;

code = code.replace(componentStartTarget, componentStartReplacement);

fs.writeFileSync('src/components/pos/ReceiptModal.tsx', code);
