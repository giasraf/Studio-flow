'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import {
  Settings,
  User,
  Clock,
  Calendar,
  Bell,
  Link2,
  Globe,
  DollarSign,
  Save,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type SettingsTab = 'profile' | 'workingHours' | 'booking' | 'notifications' | 'integrations';

export function SettingsContent() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const tabs = [
    { key: 'profile' as const, label: t('settings.profile'), icon: User },
    { key: 'workingHours' as const, label: t('settings.workingHours'), icon: Clock },
    { key: 'booking' as const, label: t('settings.booking'), icon: Calendar },
    { key: 'notifications' as const, label: t('settings.notifications'), icon: Bell },
    { key: 'integrations' as const, label: t('settings.integrations'), icon: Link2 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6 text-accent" />
          {t('settings.title')}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar tabs */}
        <div className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors text-start',
                  activeTab === tab.key
                    ? 'bg-accent/15 text-accent font-medium'
                    : 'text-muted hover:text-foreground hover:bg-surface-hover'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 glass rounded-2xl p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">{t('settings.profile')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted mb-1 block">Name</label>
                  <input
                    type="text"
                    defaultValue="Studio Flow"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted mb-1 block">{t('clients.email')}</label>
                  <input
                    type="email"
                    defaultValue="producer@studioflow.app"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted mb-1 block">{t('clients.phone')}</label>
                  <input
                    type="tel"
                    defaultValue="054-1234567"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted mb-1 block">{t('settings.language')}</label>
                  <select
                    value={locale}
                    onChange={(e) => router.replace(pathname, { locale: e.target.value as any })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="he">עברית</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted mb-1 block">{t('settings.currency')}</label>
                  <select
                    defaultValue="ILS"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="ILS">₪ ILS</option>
                    <option value="USD">$ USD</option>
                    <option value="EUR">€ EUR</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted mb-1 block">{t('projects.genre')}</label>
                  <input
                    type="text"
                    defaultValue="Pop, Hip-Hop, R&B"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>
              <button className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white rounded-xl px-6 py-2.5 text-sm font-medium transition-colors">
                <Save className="w-4 h-4" />
                {t('common.save')}
              </button>
            </div>
          )}

          {activeTab === 'workingHours' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">{t('settings.workingHours')}</h2>
              <div className="space-y-4">
                {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי'].map((day, i) => (
                  <div key={i} className="flex items-center gap-4 bg-background/50 rounded-xl p-4">
                    <div className="w-20">
                      <span className="text-sm font-medium">{day}</span>
                    </div>
                    <input
                      type="time"
                      defaultValue="10:00"
                      className="bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                    <span className="text-muted">-</span>
                    <input
                      type="time"
                      defaultValue="22:00"
                      className="bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                    <label className="flex items-center gap-2 ms-auto">
                      <input type="checkbox" defaultChecked className="accent-accent" />
                      <span className="text-sm text-muted">{t('common.active')}</span>
                    </label>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="text-sm text-muted mb-1 block">{t('calendar.duration')} ({t('calendar.minutes')})</label>
                  <input
                    type="number"
                    defaultValue={180}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted mb-1 block">הפסקה בין סשנים ({t('calendar.minutes')})</label>
                  <input
                    type="number"
                    defaultValue={30}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>
              <button className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white rounded-xl px-6 py-2.5 text-sm font-medium transition-colors">
                <Save className="w-4 h-4" />
                {t('common.save')}
              </button>
            </div>
          )}

          {activeTab === 'booking' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">{t('settings.booking')}</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between bg-background/50 rounded-xl p-4">
                  <div>
                    <p className="text-sm font-medium">אפשר ללקוחות לקבוע סשנים</p>
                    <p className="text-xs text-muted">לקוחות יוכלו לקבוע סשנים דרך הפורטל</p>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-accent w-5 h-5" />
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted mb-1 block">ימי הזמנה מראש</label>
                    <input
                      type="number"
                      defaultValue={30}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted mb-1 block">שעות ביטול מינימום</label>
                    <input
                      type="number"
                      defaultValue={24}
                      className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted mb-1 block">מחיר ברירת מחדל לשיר (₪)</label>
                  <input
                    type="number"
                    defaultValue={7000}
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>
              <button className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white rounded-xl px-6 py-2.5 text-sm font-medium transition-colors">
                <Save className="w-4 h-4" />
                {t('common.save')}
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">{t('settings.notifications')}</h2>
              <div className="space-y-3">
                {[
                  { label: 'תזכורת סשן ללקוח (24 שעות לפני)', defaultChecked: true },
                  { label: 'תזכורת סשן ללקוח (שעה לפני)', defaultChecked: true },
                  { label: 'מעקב אוטומטי (7 ימים אחרי סשן אחרון)', defaultChecked: true },
                  { label: 'התראה על תשלום שהגיע מועד פירעון', defaultChecked: true },
                  { label: 'התראה על קובץ חדש שהועלה', defaultChecked: true },
                  { label: 'התראה על הערה חדשה על מיקס', defaultChecked: true },
                  { label: 'התראה על חוזה שנחתם', defaultChecked: true },
                  { label: 'סיכום שבועי למפיק', defaultChecked: false },
                ].map((item, i) => (
                  <label key={i} className="flex items-center justify-between bg-background/50 rounded-xl p-4 cursor-pointer">
                    <span className="text-sm">{item.label}</span>
                    <input type="checkbox" defaultChecked={item.defaultChecked} className="accent-accent w-5 h-5" />
                  </label>
                ))}
              </div>
              <div>
                <label className="text-sm text-muted mb-1 block">ימי מעקב אוטומטי</label>
                <input
                  type="number"
                  defaultValue={7}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors max-w-xs"
                />
              </div>
              <button className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white rounded-xl px-6 py-2.5 text-sm font-medium transition-colors">
                <Save className="w-4 h-4" />
                {t('common.save')}
              </button>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">{t('settings.integrations')}</h2>
              <div className="space-y-4">
                {/* Google Calendar */}
                <div className="bg-background/50 rounded-xl p-5 border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{t('settings.googleCalendar')}</p>
                        <p className="text-xs text-muted">סנכרון אוטומטי של סשנים</p>
                      </div>
                    </div>
                    <button className="text-sm bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 px-4 py-2 rounded-xl transition-colors">
                      חבר
                    </button>
                  </div>
                </div>

                {/* Accounting */}
                <div className="bg-background/50 rounded-xl p-5 border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{t('settings.accounting')}</p>
                        <p className="text-xs text-muted">חיבור ל-Green Invoice / Morning / Paperless</p>
                      </div>
                    </div>
                    <button className="text-sm bg-green-500/10 text-green-400 hover:bg-green-500/20 px-4 py-2 rounded-xl transition-colors">
                      חבר
                    </button>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="bg-background/50 rounded-xl p-5 border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{t('settings.whatsapp')}</p>
                        <p className="text-xs text-muted">שליחת התראות אוטומטיות בוואטסאפ</p>
                      </div>
                    </div>
                    <button className="text-sm bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-4 py-2 rounded-xl transition-colors">
                      חבר
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
