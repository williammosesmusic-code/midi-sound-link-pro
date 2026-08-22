import { useMemo } from 'react';
import { Activity, AlertCircle, Plug, PlugZap, RefreshCw, Usb } from 'lucide-react';
import type { MidiDeviceInfo } from '@/lib/types';
import type { MidiStatus } from '@/hooks/useMidi';

interface Props {
  status: MidiStatus;
  errorMsg: string | null;
  devices: MidiDeviceInfo[];
  selectedId: string | null;
  selectedDevice: MidiDeviceInfo | null;
  connected: boolean;
  onConnect: () => void;
  onRefresh: () => void;
  onSelect: (id: string) => void;
}

export function DevicePanel({
  status,
  errorMsg,
  devices,
  selectedId,
  selectedDevice,
  connected,
  onConnect,
  onRefresh,
  onSelect,
}: Props) {
  const statusLabel = useMemo(() => {
    if (status === 'unsupported') return 'Unsupported';
    if (status === 'denied') return 'Denied';
    if (status === 'error') return 'Error';
    if (status === 'requesting') return 'Requesting...';
    if (connected) return 'MIDI Connected';
    if (devices.length > 0) return 'Select an input';
    if (status === 'granted') return 'No MIDI input detected';
    return 'Not connected';
  }, [status, connected, devices.length]);

  const statusColor = connected
    ? 'text-emerald-400'
    : status === 'denied' || status === 'error' || status === 'unsupported'
    ? 'text-rose-400'
    : 'text-amber-400';

  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Usb className="w-5 h-5 text-sky-400" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-zinc-200">
            MIDI Device
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 text-xs font-medium ${statusColor}`}>
            <Activity className="w-3.5 h-3.5" />
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={selectedId ?? ''}
          onChange={(e) => onSelect(e.target.value)}
          className="flex-1 rounded-lg bg-zinc-800/80 border border-white/10 px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
        >
          <option value="">— Select MIDI Input —</option>
          {devices.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} ({d.manufacturer}) — {d.state}
            </option>
          ))}
        </select>

        <button
          onClick={onConnect}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-500 hover:bg-sky-400 transition-colors px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plug className="w-4 h-4" />
          Connect
        </button>
        <button
          onClick={onRefresh}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors px-4 py-2.5 text-sm font-semibold text-zinc-100"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {selectedDevice && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <InfoCell label="Device" value={selectedDevice.name} />
          <InfoCell label="Manufacturer" value={selectedDevice.manufacturer} />
          <InfoCell label="Port" value={selectedDevice.id.slice(0, 8)} />
          <InfoCell
            label="Connection"
            value={selectedDevice.state}
            highlight={selectedDevice.state === 'connected' ? 'good' : 'warn'}
          />
        </div>
      )}

      {errorMsg && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-rose-500/10 border border-rose-500/30 px-3 py-2.5 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!errorMsg && status === 'granted' && devices.length === 0 && (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-2.5 text-xs text-amber-300">
          <PlugZap className="w-4 h-4 mt-0.5 shrink-0" />
          <span>No MIDI input detected. Connect your MIDI controller and press Refresh.</span>
        </div>
      )}
    </section>
  );
}

function InfoCell({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: 'good' | 'warn';
}) {
  const color =
    highlight === 'good'
      ? 'text-emerald-400'
      : highlight === 'warn'
      ? 'text-amber-400'
      : 'text-zinc-100';
  return (
    <div className="rounded-lg bg-zinc-800/50 border border-white/5 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className={`font-medium truncate ${color}`}>{value}</div>
    </div>
  );
}
