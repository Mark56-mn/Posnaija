const fs = require('fs');
let code = fs.readFileSync('src/components/pos/BarcodeScannerModal.tsx', 'utf8');

const target = `    html5QrCode.start(
      { facingMode: "environment" },`;
const replacement = `    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        // Prefer back camera if possible, otherwise just use the first one
        let cameraId = devices[0].id;
        const backCamera = devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('environment'));
        if (backCamera) {
          cameraId = backCamera.id;
        }

        html5QrCode.start(
          cameraId,`;

const target2 = `    ).catch((err) => {
      console.error(err);
      setError("Could not start camera. Please ensure you have given camera permissions.");
    });`;
const replacement2 = `        ).catch((err) => {
          console.error(err);
          setError("Could not start camera. Please ensure you have given camera permissions.");
        });
      } else {
        setError("No cameras found on your device.");
      }
    }).catch(err => {
      console.error(err);
      setError("Error accessing cameras: " + err.message);
    });`;

code = code.replace(target, replacement);
code = code.replace(target2, replacement2);

fs.writeFileSync('src/components/pos/BarcodeScannerModal.tsx', code);
