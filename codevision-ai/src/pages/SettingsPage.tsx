import { useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Bell, ShieldCheck, KeyRound } from 'lucide-react'
import AppShell from '../components/AppShell'

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button
      onClick={() => setOn(!on)}
      className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${on ? 'bg-gradient-to-r from-blue to-violet' : 'bg-base-surface2 border border-base-border'}`}
      aria-pressed={on}
    >
      <motion.span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow"
        animate={{ x: on ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  )
}

export default function SettingsPage() {
  return (
    <AppShell title="Settings" subtitle="Account, integrations, and notification preferences">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="card p-6">
            <h2 className="font-display font-semibold text-ink-hi mb-5">Profile</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-ink-mid mb-1.5 block">Full name</label>
                <input defaultValue="Shreya Fakirapur" className="input-field text-sm" />
              </div>
              <div>
                <label className="text-xs text-ink-mid mb-1.5 block">Email</label>
                <input defaultValue="shreya@codevision.ai" className="input-field text-sm" />
              </div>
            </div>
            <button className="btn-primary text-sm mt-5 !py-2.5">Save changes</button>
          </div>

          <div className="card p-6">
            <h2 className="font-display font-semibold text-ink-hi mb-5">Integrations</h2>
            <div className="flex items-center justify-between py-3 border-b border-base-border">
              <div className="flex items-center gap-3">
                <Github size={18} className="text-ink-mid" />
                <div>
                  <p className="text-sm text-ink-hi">GitHub</p>
                  <p className="text-xs text-ink-low">Connected as @shreya</p>
                </div>
              </div>
              <span className="pill bg-signal-green/10 text-signal-green border border-signal-green/25">Connected</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <KeyRound size={18} className="text-ink-mid" />
                <div>
                  <p className="text-sm text-ink-hi">API access token</p>
                  <p className="text-xs text-ink-low">For CI/CD and automated review triggers</p>
                </div>
              </div>
              <button className="btn-secondary text-xs !py-2 !px-3.5">Regenerate</button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="card p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <Bell size={16} className="text-blue-glow" />
              <h2 className="font-display font-semibold text-ink-hi">Notifications</h2>
            </div>
            {[
              ['Critical security findings', true],
              ['Review completed', true],
              ['Fix validated', false],
              ['Weekly summary', true],
            ].map(([label, on]) => (
              <div key={label as string} className="flex items-center justify-between py-2.5">
                <span className="text-sm text-ink-mid">{label as string}</span>
                <Toggle defaultOn={on as boolean} />
              </div>
            ))}
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2.5 mb-3">
              <ShieldCheck size={16} className="text-violet-glow" />
              <h2 className="font-display font-semibold text-ink-hi">Security</h2>
            </div>
            <p className="text-sm text-ink-mid leading-relaxed mb-4">
              Repository access, secrets, and source code are handled per-workspace and never leave your configured environment.
            </p>
            <button className="btn-secondary text-sm w-full justify-center">Enable two-factor auth</button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
