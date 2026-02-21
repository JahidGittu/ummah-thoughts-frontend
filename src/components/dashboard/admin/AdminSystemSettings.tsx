import { useState } from "react";
import { Save, Globe, Users, FileText, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AdminSystemSettings() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    siteName: "Ummah Thoughts",
    siteTagline: "The Islamic Knowledge Platform",
    registrationMode: "open",
    roleUpgradeRequiresApproval: true,
    contentRequiresReview: true,
    debatesEnabled: true,
    liveSessionsEnabled: true,
    maintenanceMode: false,
    defaultLanguage: "en",
    maxUploadMB: 10,
    emailNotifications: true,
    scholarVerificationRequired: true,
  });

  const toggle = (key: keyof typeof settings) =>
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const set = (key: keyof typeof settings, val: string | number) =>
    setSettings(prev => ({ ...prev, [key]: val }));

  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );

  const ToggleRow = ({ label, desc, checked, onToggle }: { label: string; desc?: string; checked: boolean; onToggle: () => void }) => (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <button onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-primary" : "bg-muted"}`}>
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <Section title={t("admin.generalSettings")} icon={Globe}>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">{t("admin.platformName")}</label>
            <input value={settings.siteName} onChange={e => set("siteName", e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">{t("admin.tagline")}</label>
            <input value={settings.siteTagline} onChange={e => set("siteTagline", e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">{t("admin.defaultLanguage")}</label>
            <select value={settings.defaultLanguage} onChange={e => set("defaultLanguage", e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="en">{t("language.en")}</option>
              <option value="bn">{t("language.bn")}</option>
            </select>
          </div>
        </div>
      </Section>

      <Section title={t("admin.userRegistration")} icon={Users}>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">{t("admin.registrationMode")}</label>
            <select value={settings.registrationMode} onChange={e => set("registrationMode", e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="open">{t("admin.openMode")}</option>
              <option value="moderated">{t("admin.moderatedMode")}</option>
              <option value="closed">{t("admin.closedMode")}</option>
            </select>
          </div>
          <ToggleRow label={t("admin.roleUpgradeApproval")} desc={t("admin.roleUpgradeApprovalDesc")} checked={settings.roleUpgradeRequiresApproval} onToggle={() => toggle("roleUpgradeRequiresApproval")} />
          <ToggleRow label={t("admin.scholarVerificationRequired")} desc={t("admin.scholarVerificationRequiredDesc")} checked={settings.scholarVerificationRequired} onToggle={() => toggle("scholarVerificationRequired")} />
        </div>
      </Section>

      <Section title={t("admin.contentSettings")} icon={FileText}>
        <div className="space-y-4">
          <ToggleRow label={t("admin.contentReviewRequired")} checked={settings.contentRequiresReview} onToggle={() => toggle("contentRequiresReview")} />
          <ToggleRow label={t("admin.debatesEnabled")} checked={settings.debatesEnabled} onToggle={() => toggle("debatesEnabled")} />
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">{t("admin.maxUploadSize")}</label>
            <input type="number" value={settings.maxUploadMB} onChange={e => set("maxUploadMB", Number(e.target.value))}
              className="w-32 h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>
      </Section>

      <Section title={t("admin.securityMaintenance")} icon={Lock}>
        <div className="space-y-4">
          <ToggleRow label={t("admin.emailNotifications")} desc={t("admin.emailNotificationsDesc")} checked={settings.emailNotifications} onToggle={() => toggle("emailNotifications")} />
          <ToggleRow label={t("admin.maintenanceMode")} desc={t("admin.maintenanceModeDesc")} checked={settings.maintenanceMode} onToggle={() => toggle("maintenanceMode")} />
        </div>
      </Section>

      <button onClick={save}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
          saved ? "bg-emerald-500 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}>
        <Save className="h-4 w-4" />
        {saved ? t("admin.saved") : t("admin.saveSettings")}
      </button>
    </div>
  );
}
