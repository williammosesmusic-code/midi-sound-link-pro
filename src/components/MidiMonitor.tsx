import { Trash2, Radio } from 'lucide-react';
import type { MonitorEntry } from '@/lib/types';

interface Props {
  monitor: MonitorEntry[];
  onClear: () => void;
}

export function MidiMonitor({ monitor, onClear }: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-zinc-200">
            MIDI Monitor
          </h2>
        </div>
        <button
          onClick={onClear}
          className="inline-flex items-center gap-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 transition-colors px-2.5 py-1.5 text-xs text-zinc-300"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-zinc-500 border-b border-white/5">
              <th className="py-2 pr-3 font-medium">Device</th>
              <th className="py-2 pr-3 font-medium">Ch</th>
              <th className="py-2 pr-3 font-medium">Type</th>
              <th className="py-2 pr-3 font-medium">Note</th>
              <th className="py-2 pr-3 font-medium">Vel</th>
              <th className="py-2 pr-3 font-medium">On/Off</th>
              <th className="py-2 pr-3 font-medium">Patch</th>
              <th className="py-2 pr-3 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {monitor.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-zinc-600">
                  Waiting for MIDI messages...
                </td>
              </tr>
            )}
            {monitor.map((e) => (
              <tr
                key={e.id}
                className={`border-b border-white/5 ${
                  e.onOff === 'ON' ? 'bg-emerald-500/5' : ''
                }`}
              >
                <td className="py-2 pr-3 text-zinc-300 truncate max-w-[140px]">{e.device}</td>
                <td className="py-2 pr-3 text-zinc-400">{e.channel}</td>
                <td className="py-2 pr-3">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      e.onOff === 'ON'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-zinc-700/50 text-zinc-400'
                    }`}
                  >
                    {e.type}
                  </span>
                </td>
                <td className="py-2 pr-3 font-mono text-sky-300">{e.note}</td>
                <td className="py-2 pr-3 font-mono text-zinc-300">{e.velocity}</td>
                <td className="py-2 pr-3">
                  <span
                    className={
                      e.onOff === 'ON' ? 'text-emerald-400 font-semibold' : 'text-zinc-500'
                    }
                  >
                    {e.onOff}
                  </span>
                </td>
                <td className="py-2 pr-3">
                  {e.patch ? (
                    <span className="text-amber-300 font-medium">#{e.patch}</span>
                  ) : (
                    <span className="text-zinc-600">—</span>
                  )}
                </td>
                <td className="py-2 pr-3 text-zinc-500 font-mono">
                  {(e.timestamp / 1000).toFixed(2)}s
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
