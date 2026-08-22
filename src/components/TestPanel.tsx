import { CheckCircle2, Drum, XCircle } from 'lucide-react';
import type { MonitorEntry } from '@/lib/types';

interface Props {
  lastMessage: MonitorEntry | null;
  connected: boolean;
  deviceName: string | null;
  waitingForMessages: boolean;
}

export function TestPanel({
  lastMessage,
  connected,
  deviceName,
  waitingForMessages,
}: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur p-5">
      <div className="flex items-center gap-2 mb-4">
        <Drum className="w-5 h-5 text-amber-400" />
        <h2 className="text-sm font-semibold tracking-wide uppercase text-zinc-200">
          MIDI Test Panel
        </h2>
      </div>

      <div className="rounded-xl bg-black/40 border border-white/5 p-6 min-h-[160px]">
        {!connected && (
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <XCircle className="w-5 h-5 text-rose-400" />
            No MIDI input selected. Connect a device and select an input.
          </div>
        )}
        {connected && !lastMessage && (
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            MIDI device connected, waiting for MIDI messages.
            {waitingForMessages ? ' Hit a pad to test.' : ''}
          </div>
        )}
        {lastMessage && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5" />
              MIDI RECEIVED
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <Stat label="Device" value={lastMessage.device} />
              <Stat label="Channel" value={String(lastMessage.channel)} />
              <Stat label="Note" value={String(lastMessage.note)} accent="sky" />
              <Stat label="Velocity" value={String(lastMessage.velocity)} />
              <Stat label="Type" value={lastMessage.type} />
              <Stat
                label="Mapped Patch"
                value={lastMessage.patch ? `#${lastMessage.patch}` : 'NONE'}
                accent={lastMessage.patch ? 'amber' : 'muted'}
              />
              <Stat
                label="Sound"
                value={lastMessage.sound ?? 'No Patch Assigned'}
                accent={lastMessage.sound ? 'emerald' : 'muted'}
              />
            </div>
            {deviceName && !lastMessage.patch && (
              <p className="text-xs text-rose-300">
                Received Note {lastMessage.note} — No Patch Assigned.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: 'sky' | 'amber' | 'emerald' | 'muted';
}) {
  const color =
    accent === 'sky'
      ? 'text-sky-300'
      : accent === 'amber'
      ? 'text-amber-300'
      : accent === 'emerald'
      ? 'text-emerald-300'
      : accent === 'muted'
      ? 'text-zinc-500'
      : 'text-zinc-100';
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className={`font-mono font-semibold truncate ${color}`}>{value}</div>
    </div>
  );
}
