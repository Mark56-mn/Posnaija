const fs = require('fs');

const buttonImport = `import { Button } from '../../components/ui/Button';\n`;
const backButtonHtml = `
        <div className="mt-12 flex justify-center pb-8">
          <Link to="/auth/register">
            <Button size="lg" className="px-8 bg-[var(--color-accent)] text-[var(--color-primary)] hover:bg-[var(--color-accent)]/90">
              Back to Account Creation
            </Button>
          </Link>
        </div>`;

['src/pages/public/TermsPage.tsx', 'src/pages/public/PrivacyPolicyPage.tsx'].forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  
  // Add import
  if (!code.includes('import { Button }')) {
    code = code.replace("import { Link } from 'react-router-dom';", "import { Link } from 'react-router-dom';\n" + buttonImport);
  }

  // Add button at the bottom
  if (!code.includes('Back to Account Creation')) {
    code = code.replace("      </div>\n    </div>", backButtonHtml + "\n      </div>\n    </div>");
  }

  fs.writeFileSync(file, code);
});
