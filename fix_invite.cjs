const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/SettingsPage.tsx', 'utf8');

// Update invite code generation in Settings
const inviteUseEffect = `
  useEffect(() => {
    async function ensureInviteCode() {
      if (session && session.role === 'admin') {
        const { data } = await supabase.from('profiles').select('invite_code').eq('id', session.admin_id).single();
        if (data && !data.invite_code) {
          const code = Math.random().toString(36).substring(2, 8).toUpperCase();
          await supabase.from('profiles').update({ invite_code: code }).eq('id', session.admin_id);
          // Just update local display
          session.invite_code = code;
        } else if (data) {
          session.invite_code = data.invite_code;
        }
      }
    }
    ensureInviteCode();
  }, [session]);
`;

code = code.replace(
  "  useEffect(() => {\n    if (session && session.role === 'admin' && !session.invite_code_set) {\n       // ensure invite code logic if needed, but we'll use first segment of admin_id.\n    }\n  }, [session]);",
  inviteUseEffect
);

code = code.replace(
  "{session.admin_id.split('-')[0].toUpperCase()}",
  "{(session as any).invite_code || 'Loading...'}"
);

fs.writeFileSync('src/pages/dashboard/SettingsPage.tsx', code);

// Update AuditorLoginPage.tsx to use invite_code column
let auditorCode = fs.readFileSync('src/pages/auth/AuditorLoginPage.tsx', 'utf8');
auditorCode = auditorCode.replace(
  "ilike('id', formData.inviteCode + '-%')",
  "eq('invite_code', formData.inviteCode.toUpperCase())"
);
fs.writeFileSync('src/pages/auth/AuditorLoginPage.tsx', auditorCode);
