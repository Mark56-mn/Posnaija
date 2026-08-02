const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/SettingsPage.tsx', 'utf8');

const target = `                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (`;

const replacement = `                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
          ) : (`;

code = code.replace(target, replacement);
fs.writeFileSync('src/pages/dashboard/SettingsPage.tsx', code);
