const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/SettingsPage.tsx', 'utf8');

// I need to wrap the first part of the ternary in a fragment.
// Actually, let's just find the start of the true branch and add a div.

code = code.replace(
  '{isEditingBusiness ? (\\n            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">',
  '{isEditingBusiness ? (\\n            <div className="space-y-4">\\n              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">'
);
code = code.replace(
  '{isEditingBusiness ? (\n            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">',
  '{isEditingBusiness ? (\n            <div className="space-y-4">\n              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">'
);

code = code.replace(
  '              </div>\\n            )}',
  '              </div>\\n            </div>\\n            )}'
);

code = code.replace(
  '              </div>\n            )}\n          ) : (',
  '              </div>\n            </div>\n          ) : ('
);

fs.writeFileSync('src/pages/dashboard/SettingsPage.tsx', code);
