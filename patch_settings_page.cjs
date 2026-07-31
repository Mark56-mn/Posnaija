const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/SettingsPage.tsx', 'utf8');

code = code.replace(
  "import { usePermissions } from '../../hooks/usePermissions';",
  "import { usePermissions } from '../../hooks/usePermissions';\nimport { useState, useEffect } from 'react';\nimport { Input } from '../../components/ui/Input';\nimport { Trash2, Building2, UserCircle2 } from 'lucide-react';\nimport { supabase } from '../../lib/supabase';\nimport { useLiveQuery } from 'dexie-react-hooks';"
);

// We need to add "invite_code" generation to supabase logic, but we can do it simply by using the admin's UUID as the invite code.
const branchesAndAuditorsSection = `
      {/* Pro Plan Features: Branches and Auditors */}
      {(session.plan === 'pro' || session.plan === 'lifetime') && session.role === 'admin' && (
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <Building2 className="h-5 w-5 text-[var(--color-accent)]" /> Branches
              </h2>
              <div className="space-y-4">
                <form onSubmit={handleAddBranch} className="flex gap-2">
                  <Input 
                    placeholder="New Branch Name" 
                    value={newBranchName} 
                    onChange={e => setNewBranchName(e.target.value)} 
                    required 
                  />
                  <Button type="submit">Add</Button>
                </form>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {branches?.map(b => (
                    <div key={b.id} className="flex justify-between items-center p-3 bg-[var(--color-background)] rounded border border-[var(--color-muted)]/10">
                      <span className="font-medium">{b.name}</span>
                      <Button variant="ghost" size="sm" className="text-[var(--color-danger)]" onClick={() => handleDeleteBranch(b.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {branches?.length === 0 && <p className="text-sm text-[var(--color-muted)]">No branches created.</p>}
                </div>
                {/* Branch Selection for current device */}
                <div className="pt-4 border-t border-[var(--color-muted)]/10">
                  <p className="text-sm text-[var(--color-muted)] mb-2">Select Active Branch For This Device</p>
                  <select 
                    className="flex h-10 w-full rounded-md border border-[var(--color-muted)]/30 bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                    value={session.branch_id || ''}
                    onChange={(e) => handleSetDeviceBranch(e.target.value)}
                  >
                    <option value="">Main/Default (No Branch)</option>
                    {branches?.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <UserCircle2 className="h-5 w-5 text-[var(--color-accent)]" /> Auditors
              </h2>
              <div className="space-y-4">
                <div className="p-3 bg-[var(--color-background)] rounded border border-[var(--color-muted)]/10">
                  <p className="text-sm text-[var(--color-muted)] mb-1">Your Business Invite Code:</p>
                  <div className="flex justify-between items-center">
                    <code className="bg-[var(--color-surface)] px-2 py-1 rounded text-[var(--color-accent)] text-lg select-all">
                      {session.admin_id.split('-')[0].toUpperCase()}
                    </code>
                    <p className="text-xs text-[var(--color-muted)] max-w-[150px] text-right">
                      Share this code with auditors to register via the Auditor Portal.
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-[var(--color-muted)]/10">
                   <p className="text-sm text-[var(--color-muted)]">
                     Auditors log in via the internet to view consolidated reports for all branches.
                   </p>
                   <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => window.open('/auditor/login', '_blank')}
                   >
                     Open Auditor Portal
                   </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
`;

code = code.replace(
  "export default function SettingsPage() {\n  const { session } = usePermissions();\n  const [upgrading, setUpgrading] = useState(false);",
  "export default function SettingsPage() {\n  const { session } = usePermissions();\n  const [upgrading, setUpgrading] = useState(false);\n  const [newBranchName, setNewBranchName] = useState('');\n  const branches = useLiveQuery(() => db.branches.toArray());\n\n  useEffect(() => {\n    if (session && session.role === 'admin' && !session.invite_code_set) {\n       // ensure invite code logic if needed, but we'll use first segment of admin_id.\n    }\n  }, [session]);\n\n  const handleAddBranch = async (e: React.FormEvent) => {\n    e.preventDefault();\n    if (!session || !newBranchName.trim()) return;\n    await db.branches.put({\n      id: crypto.randomUUID(),\n      admin_id: session.admin_id,\n      name: newBranchName.trim(),\n      created_at: new Date().toISOString(),\n      synced: false\n    });\n    setNewBranchName('');\n  };\n\n  const handleDeleteBranch = async (id: string) => {\n    if (confirm('Are you sure you want to delete this branch?')) {\n      await db.branches.delete(id);\n      if (session.branch_id === id) {\n         await db.session.update(session.id, { branch_id: undefined, branch_name: undefined });\n         window.location.reload();\n      }\n    }\n  };\n\n  const handleSetDeviceBranch = async (id: string) => {\n    if (!session) return;\n    if (id === '') {\n      await db.session.update(session.id, { branch_id: undefined, branch_name: undefined });\n    } else {\n      const b = await db.branches.get(id);\n      if (b) await db.session.update(session.id, { branch_id: b.id, branch_name: b.name });\n    }\n    window.location.reload();\n  };\n"
);

code = code.replace(
  "</div>\n        </CardContent>\n      </Card>\n      <div className=\"space-y-4\">",
  "</div>\n        </CardContent>\n      </Card>\n\n" + branchesAndAuditorsSection + "\n\n      <div className=\"space-y-4\">"
);

fs.writeFileSync('src/pages/dashboard/SettingsPage.tsx', code);
