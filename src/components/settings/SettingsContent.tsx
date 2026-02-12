'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import {
  User,
  Clock,
  Calendar,
  Bell,
  Link2,
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

  const inputClass = 'w-full bg-background border border-border rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-foreground transition-colors';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{t('settings.title')}</h1>
        <p className="text-[13px] text-muted mt-1">{t('settings.subtitle') || (locale === 'he' ? 'הגדרות הסטודיו שלך' : 'Your studio settings')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar tabs */}
        <div className="space-y-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors text-start',
                  activeTab === tab.key
                    ? 'bg-surface-hover text-foreground font-medium'
                    : 'text-muted hover:text-foreground hover:bg-surface'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 bg-background border border-border rounded-xl p-6">
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <h2 className="text-[15px] font-semibold">{t('settings.profile')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-medium text-muted mb-1.5 block">Name</label>
                  <input type="text" defaultValue="Studio Flow" className={inputClass} />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-muted mb-1.5 block">{t('clients.email')}</label>
                  <input type="email" defaultValue="producer@studioflow.app" className={inputClass} />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-muted mb-1.5 block">{t('clients.phone')}</label>
                  <input type="tel" defaultValue="054-1234567" className={inputClass} />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-muted mb-1.5 block">{t('settings.language')}</label>
                  <select
                    value={locale}
                    onChange={(e) => router.replace(pathname, { locale: e.target.value as any })}
                    className={inputClass}
                  >
                    <option value="he">עברית</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-medium text-muted mb-1.5 block">{t('settings.currency')}</label>
                  <select defaultValue="ILS" className={inputClass}>
                    <option value="ILS">₪ ILS</option>
                    <option value="USD">$ USD</option>
                    <option value="EUR">€ EUR</option>
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-medium text-muted mb-1.5 block">{t('projects.genre')}</label>
                  <input type="text" defaultValue="Pop, Hip-Hop, R&B" className={inputClass} />
                </div>
              </div>
              <button className="flex items-center gap-1.5 bg-foreground hover:bg-foreground/90 text-background rounded-lg px-4 py-2 text-[13px] font-medium transition-colors">
                <Save className="w-3.5 h-3.5" />
                {t('common.save')}
              </button>
            </div>
          )}

          {activeTab === 'workingHours' && (
            <div className="space-y-5">
              <h2 className="text-[15px] font-semibold">{t('settings.workingHours')}</h2>
              <div className="space-y-2">
                {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי'].map((day, i) => (
                  <div key={i} className="flex items-center gap-4 border border-border rounded-lg p-3">
                    <div className="w-16">
                      <span className="text-[13px] font-medium">{day}</span>
                    </div>
                    <input
                      type="time"
                      defaultValue="10:00"
                      className="bg-background border border-border rounded-lg px-2.5 py-1.5 text-[13px] focus:outline-none focus:border-foreground transition-colors"
                    />
                    <span className="text-muted text-[13px]">-</span>
                    <input
                      type="time"
                      defaultValue="22:00"
                      className="bg-background border border-border rounded-lg px-2.5 py-1.5 text-[13px] focus:outline-none focus:border-foreground transition-colors"
                    />
                    <label className="flex items-center gap-2 ms-auto">
                      <input type="checkbox" defaultChecked className="accent-foreground" />
                      <span className="text-[12px] text-muted">{t('common.active')}</span>
                    </label>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-[12px] font-medium text-muted mb-1.5 block">{t('calendar.duration')} ({t('calendar.minutes')})</label>
                  <input type="number" defaultValue={180} className={inputClass} />
                </div>
                <div>
                  <label className="text-[12px] font-medium text-muted mb-1.5 block">
                    {locale === 'he' ? 'הפסקה בין סשנים' : 'Break between sessions'} ({t('calendar.minutes')})
                  </label>
                  <input type="number" defaultValue={30} className={inputClass} />
                </div>
              </div>
              <button className="flex items-center gap-1.5 bg-foreground hover:bg-foreground/90 text-background rounded-lg px-4 py-2 text-[13px] font-medium transition-colors">
                <Save className="w-3.5 h-3.5" />
                {t('common.save')}
              </button>
            </div>
          )}

          {activeTab === 'booking' && (
            <div className="space-y-5">
              <h2 className="text-[15px] font-semibold">{t('settings.booking')}</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between border border-border rounded-lg p-3.5 cursor-pointer hover:bg-surface transition-colors">
                  <div>
                    <p className="text-[13px] font-medium">{locale === 'he' ? 'אפשר ללקוחות לקבוע סשנים' : 'Allow clients to book sessions'}</p>
                    <p className="text-[12px] text-muted">{locale === 'he' ? 'לקוחות יוכלו לקבוע סשנים דרך הפורטל' : 'Clients can book sessions through the portal'}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-foreground w-4 h-4" />
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] font-medium text-muted mb-1.5 block">{locale === 'he' ? 'ימי הזמנה מראש' : 'Advance booking days'}</label>
                    <input type="number" defaultValue={30} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-muted mb-1.5 block">{locale === 'he' ? 'שעות ביטול מינימום' : 'Min. cancellation hours'}</label>
                    <input type="number" defaultValue={24} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="text-[12px] font-medium text-muted mb-1.5 block">{locale === 'he' ? 'מחיר ברירת מחדל לשיר (₪)' : 'Default song price (₪)'}</label>
                  <input type="number" defaultValue={7000} className={inputClass} />
                </div>
              </div>
              <button className="flex items-center gap-1.5 bg-foreground hover:bg-foreground/90 text-background rounded-lg px-4 py-2 text-[13px] font-medium transition-colors">
                <Save className="w-3.5 h-3.5" />
                {t('common.save')}
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-5">
              <h2 className="text-[15px] font-semibold">{t('settings.notifications')}</h2>
              <div className="space-y-2">
                {[
                  { label: locale === 'he' ? 'תזכורת סשן ללקוח (24 שעות לפני)' : 'Session reminder (24h before)', defaultChecked: true },
                  { label: locale === 'he' ? 'תזכורת סשן ללקוח (שעה לפני)' : 'Session reminder (1h before)', defaultChecked: true },
                  { label: locale === 'he' ? 'מעקב אוטומטי (7 ימים אחרי סשן אחרון)' : 'Auto follow-up (7 days after last session)', defaultChecked: true },
                  { label: locale === 'he' ? 'התראה על תשלום שהגיע מועד פירעון' : 'Payment due notification', defaultChecked: true },
                  { label: locale === 'he' ? 'התראה על קובץ חדש שהועלה' : 'New file upload notification', defaultChecked: true },
                  { label: locale === 'he' ? 'התראה על הערה חדשה על מיקס' : 'New mix comment notification', defaultChecked: true },
                  { label: locale === 'he' ? 'סיכום שבועי למפיק' : 'Weekly summary for producer', defaultChecked: false },
                ].map((item, i) => (
                  <label key={i} className="flex items-center justify-between border border-border rounded-lg p-3.5 cursor-pointer hover:bg-surface transition-colors">
                    <span className="text-[13px]">{item.label}</span>
                    <input type="checkbox" defaultChecked={item.defaultChecked} className="accent-foreground w-4 h-4" />
                  </label>
                ))}
              </div>
              <div>
                <label className="text-[12px] font-medium text-muted mb-1.5 block">{locale === 'he' ? 'ימי מעקב אוטומטי' : 'Auto follow-up days'}</label>
                <input type="number" defaultValue={7} className={cn(inputClass, 'max-w-xs')} />
              </div>
              <button className="flex items-center gap-1.5 bg-foreground hover:bg-foreground/90 text-background rounded-lg px-4 py-2 text-[13px] font-medium transition-colors">
                <Save className="w-3.5 h-3.5" />
                {t('common.save')}
              </button>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-5">
              <h2 className="text-[15px] font-semibold">{t('settings.integrations')}</h2>
              <div className="space-y-3">
                {/* Google Calendar */}
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Calendar className="w-4.5 h-4.5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-[13px]">{t('settings.googleCalendar')}</p>
                        <p className="text-[12px] text-muted">{locale === 'he' ? 'סנכרון אוטומטי של סשנים' : 'Auto sync sessions'}</p>
                      </div>
                    </div>
                    <button className="text-[12px] border border-border hover:bg-surface-hover px-3 py-1.5 rounded-lg transition-colors font-medium">
                      {locale === 'he' ? 'חבר' : 'Connect'}
                    </button>
                  </div>
                </div>

                {/* Accounting */}
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                        <DollarSign className="w-4.5 h-4.5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-[13px]">{t('settings.accounting')}</p>
                        <p className="text-[12px] text-muted">Green Invoice / Morning / Paperless</p>
                      </div>
                    </div>
                    <button className="text-[12px] border border-border hover:bg-surface-hover px-3 py-1.5 rounded-lg transition-colors font-medium">
                      {locale === 'he' ? 'חבר' : 'Connect'}
                    </button>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <Bell className="w-4.5 h-4.5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-[13px]">{t('settings.whatsapp')}</p>
                        <p className="text-[12px] text-muted">{locale === 'he' ? 'שליחת התראות אוטומטיות בוואטסאפ' : 'Auto WhatsApp notifications'}</p>
                      </div>
                    </div>
                    <button className="text-[12px] border border-border hover:bg-surface-hover px-3 py-1.5 rounded-lg transition-colors font-medium">
                      {locale === 'he' ? 'חבר' : 'Connect'}
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
