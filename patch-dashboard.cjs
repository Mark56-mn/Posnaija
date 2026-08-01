const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/DashboardHome.tsx', 'utf8');

const importTarget = `import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';`;
const importReplacement = `import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import QuickSaleModal from '../../components/pos/QuickSaleModal';
import ReceiptModal from '../../components/pos/ReceiptModal';
import { Zap } from 'lucide-react';`;

if (code.includes(importTarget)) {
  code = code.replace(importTarget, importReplacement);
}

const stateTarget = `  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [expiringProducts, setExpiringProducts] = useState<any[]>([]);`;
const stateReplacement = `  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [expiringProducts, setExpiringProducts] = useState<any[]>([]);
  const [showQuickSale, setShowQuickSale] = useState(false);
  const [completedSale, setCompletedSale] = useState<any>(null);`;

code = code.replace(stateTarget, stateReplacement);

const actionTarget = `<Link to="/dashboard/new-sale" className="block">
              <Button size="lg" className="w-full justify-start text-lg h-14">
                <ShoppingCart className="mr-3 h-5 w-5" /> New Sale
              </Button>
            </Link>`;
const actionReplacement = `<Link to="/dashboard/new-sale" className="block">
              <Button size="lg" className="w-full justify-start text-lg h-14">
                <ShoppingCart className="mr-3 h-5 w-5" /> Full POS
              </Button>
            </Link>
            <Button size="lg" className="w-full justify-start text-lg h-14 bg-[var(--color-accent)] text-[var(--color-primary)] hover:bg-[var(--color-accent)]/90" onClick={() => setShowQuickSale(true)}>
              <Zap className="mr-3 h-5 w-5" /> Quick Sale
            </Button>`;

code = code.replace(actionTarget, actionReplacement);

const returnEndTarget = `    </div>
  );
}`;
const returnEndReplacement = `
      {showQuickSale && (
        <QuickSaleModal 
          session={session} 
          onClose={() => setShowQuickSale(false)} 
          onSaleComplete={(sale) => {
            setShowQuickSale(false);
            setCompletedSale(sale);
            // reload stats
            setTimeout(() => window.location.reload(), 100); // Simple way to refresh dashboard
          }} 
        />
      )}
      
      {completedSale && (
        <ReceiptModal 
          sale={completedSale} 
          session={session} 
          onClose={() => setCompletedSale(null)} 
        />
      )}
    </div>
  );
}`;

code = code.replace(returnEndTarget, returnEndReplacement);

fs.writeFileSync('src/pages/dashboard/DashboardHome.tsx', code);
