import { useRef } from 'react';
import { Download, FileUp, RotateCcw, Save, Volume2, Waves } from 'lucide-react';
import type { Kit } from '@/lib/types';

interface Props {
  audioReady: boolean;
  kits: Kit[];
  selectedKitId: string;
  onSave: () => void;
  onReset: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onTestAudio: () => void;
  onSwitchKit: (id: string) => void;
}

export function Toolbar({
  audioReady,
  kits,
  selectedKitId,
  onSave,
  onReset,
  onExport,
  onImport,
  onTestAudio,
  onSwitchKit,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur p-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-2 mr-2">
          <Waves className="w-5 h-5 text-sky-400" />
          <span className="text-sm font-semibold tracking-wide uppercase text-zinc-200">
            Drum Pad Prototype
          </span>
          <span
            className={`ml-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${
              audioReady
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-zinc-700/50 text-zinc-400'
            }`}
          >
            Audio {audioReady ? 'Ready' : 'Idle'}
          </span>
        </div>

        <div className="flex items-center gap-2 mr-2">
          <label className="text-[10px] uppercase tracking-wider text-zinc-500">Kit</label>
          <select
            value={selectedKitId}
            onChange={(e) => onSwitchKit(e.target.value)}
            className="rounded-lg bg-zinc-800/80 border border-white/10 px-2.5 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
          >
            {kits.map((k) => (
              <option key={k.id} value={k.id}>
                {k.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1" />

        <button
          onClick={onTestAudio}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-2 text-sm text-zinc-200"
        >
          <Volume2 className="w-4 h-4 text-emerald-400" />
          Test Audio
        </button>
        <button
          onClick={onSave}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-2 text-sm text-zinc-200"
        >
          <Save className="w-4 h-4 text-sky-400" />
          Save
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-2 text-sm text-zinc-200"
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
          Reset
        </button>
        <button
          onClick={onExport}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-2 text-sm text-zinc-200"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          Export
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-2 text-sm text-zinc-200"
        >
          <FileUp className="w-4 h-4 text-sky-400" />
          Import
        </button>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onImport(f);
            e.target.value = '';
          }}
        />
      </div>
    </section>
  );
}
