const fs = require('fs');
let code = fs.readFileSync('src/pages/public/LandingPage.tsx', 'utf8');

const importTarget = `import { WifiOff, Smartphone, Receipt, MessageSquare, Users, BarChart3 } from 'lucide-react';`;
const importReplacement = `import { WifiOff, Smartphone, Receipt, MessageSquare, Users, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import TutorialModal from '../../components/TutorialModal';`;

if (code.includes(importTarget)) {
  code = code.replace(importTarget, importReplacement);
}

const componentStartTarget = `export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">`;
const componentStartReplacement = `export default function LandingPage() {
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <div className="flex flex-col items-center">
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}`;

code = code.replace(componentStartTarget, componentStartReplacement);

const buttonTarget = `<Link to="/#how-it-works">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">See How It Works</Button>
            </Link>`;
const buttonReplacement = `<Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => setShowTutorial(true)}>See How It Works</Button>`;

code = code.replace(buttonTarget, buttonReplacement);

fs.writeFileSync('src/pages/public/LandingPage.tsx', code);
