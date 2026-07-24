import { type FormEvent, useEffect, useState } from 'react';
import { Eye, EyeOff, Save, Send, Server, ShieldCheck, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminSettings, useUpdateAdminSettings } from '../../hooks/queries';

export default function WhatsappSettingsPanel() {
  const { data: settings, isLoading, isError } = useAdminSettings();
  const updateSettings = useUpdateAdminSettings();

  const [whatsappApiUrl, setWhatsappApiUrl] = useState('');
  const [whatsappApiKey, setWhatsappApiKey] = useState('');
  const [whatsappSessionId, setWhatsappSessionId] = useState('main');
  const [adminPhone, setAdminPhone] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    if (settings) {
      setWhatsappApiUrl(settings.whatsappApiUrl || '');
      setWhatsappApiKey(settings.whatsappApiKey || '');
      setWhatsappSessionId(settings.whatsappSessionId || 'main');
      setAdminPhone(settings.adminPhone || '');
    }
  }, [settings]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings.mutateAsync({
        whatsappApiUrl,
        whatsappApiKey,
        whatsappSessionId,
        adminPhone,
      });
      toast.success('WhatsApp settings updated successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update settings');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[var(--dark-card)]">
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading settings...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        Could not load settings. Check that your backend is running.
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-[var(--dark-card)]">
      <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-700">
        <h3 className="text-xl font-bold text-[var(--navy)] dark:text-white">
          WhatsApp Service Configuration
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
          Manage API endpoint credentials and notification phone number for booking confirmations and daily digests.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* WhatsApp API Base URL */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              <Server className="h-4 w-4 text-[var(--teal)]" />
              WhatsApp API Base URL
            </label>
            <input
              type="url"
              value={whatsappApiUrl}
              onChange={(e) => setWhatsappApiUrl(e.target.value)}
              placeholder="https://your-whatsapp-service.com"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-[var(--teal)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/20 dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Endpoint URL hosting <code className="font-mono">/send-message</code>.
            </p>
          </div>

          {/* Session ID */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              <Send className="h-4 w-4 text-[var(--teal)]" />
              Session ID / Name
            </label>
            <input
              type="text"
              value={whatsappSessionId}
              onChange={(e) => setWhatsappSessionId(e.target.value)}
              placeholder="main"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-[var(--teal)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/20 dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              The session name registered in your WhatsApp API (default is <code className="font-mono">main</code>).
            </p>
          </div>

          {/* API Key */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              <ShieldCheck className="h-4 w-4 text-[var(--teal)]" />
              API Key / Bearer Token
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={whatsappApiKey}
                onChange={(e) => setWhatsappApiKey(e.target.value)}
                placeholder="Leave blank if no authentication token is required"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 focus:border-[var(--teal)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/20 dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Passed in <code className="font-mono">Authorization</code> and <code className="font-mono">x-api-key</code> headers.
            </p>
          </div>

          {/* Admin Phone */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              <Smartphone className="h-4 w-4 text-[var(--teal)]" />
              Admin Notification Phone Number
            </label>
            <input
              type="text"
              value={adminPhone}
              onChange={(e) => setAdminPhone(e.target.value)}
              placeholder="e.g. 01273809805 or 201273809805"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-[var(--teal)] focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/20 dark:border-gray-600 dark:bg-[var(--dark-muted)] dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Number receiving admin alert messages when new bookings are submitted.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={updateSettings.isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--teal)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </section>
  );
}
