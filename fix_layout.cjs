const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/DashboardLayout.tsx', 'utf8');

code = code.replace("    </div>\n    </div>", "    </div>\n    </div>\n");

// wait, the extra div wrapping is already there. Let's fix the ending.
code = code.replace("    </div>\n    </div>", "      </div>\n    </div>");

fs.writeFileSync('src/pages/dashboard/DashboardLayout.tsx', code);
