import { Eraser, Pencil, Sparkles, Volume2 } from 'lucide-react';
import type { Patch } from '@/lib/types';
import { DRUM_SOUNDS } from '@/lib/audio';
import { drumName, noteName } from '@/lib/midi';

interface Props {
  patch: Patch;
  learning: boolean;
  lastHit: boolean;
  onLearn: () => void;
  onEdit: () => void;
  onClear: () => void;
  onPreview: () => void;
}

export function PatchCard({
  patch,
  learning,
  lastHit,
  onLearn,
  onEdit,
  onClear,
  onPreview,
}: Props) {
  const soundLabel = DRUM_SOUNDS.find((s) => s.id === patch.sound)?.label ?? patch.sound;

  return (
    <div
      className={`relative rounded-xl border p-3 transition-all duration-150 ${
        lastHit
          ? 'border-emerald-400 bg-emerald-500/15 shadow-[0_0_0_1px_rgba(52,211,153,0.4)]'
          : learning
          ? 'border-amber-400 bg-amber-500/10 animate-pulse'
          : patch.note !== null
          ? 'border-sky-500/40 bg-zinc-800/60'
          : 'border-white/10 bg-zinc-900/50'
      } ${!patch.enabled ? 'opacity-40' : ''}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-zinc-500">#{patch.id}</span>
          {patch.note !== null && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">
              {patch.note}
            </span>
          )}
        </div>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={patch.enabled}
            onChange={(e) => e.stopPropagation()}
            className="sr-only"
            disabled
          />
          <span
            className={`w-2 h-2 rounded-full ${
              patch.enabled ? 'bg-emerald-400' : 'bg-zinc-600'
            }`}
          />
        </label>
      </div>

      <div className="text-sm font-semibold text-zinc-100 truncate mb-0.5">
        {patch.name}
      </div>
      <div className="text-xs text-zinc-400 truncate mb-1">
        {patch.sampleName ? (
          <span className="text-emerald-400/90">{patch.sampleName}</span>
        ) : (
          soundLabel
        )}
      </div>
      {patch.note !== null ? (
        <div className="text-[11px] text-zinc-500 font-mono mb-2">
          {patch.channel !== null ? `Ch ${patch.channel} · ` : ''}
          {noteName(patch.note)} · {drumName(patch.note)}
        </div>
      ) : (
        <div className="text-[11px] text-zinc-600 mb-2">No note assigned</div>
      )}

      <div className="flex items-center gap-1">
        <button
          onClick={onLearn}
          className={`flex-1 inline-flex items-center justify-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors ${
            learning
              ? 'bg-amber-500 text-black'
              : 'bg-zinc-700/70 hover:bg-zinc-600 text-zinc-200'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          {learning ? 'Learning...' : 'Learn'}
        </button>
        <button
          onClick={onEdit}
          className="inline-flex items-center justify-center rounded-md bg-zinc-700/70 hover:bg-zinc-600 px-2 py-1.5 text-zinc-200 transition-colors"
          title="Edit"
        >
          <Pencil className="w-3 h-3" />
        </button>
        <button
          onClick={onClear}
          className="inline-flex items-center justify-center rounded-md bg-zinc-700/70 hover:bg-rose-600/60 px-2 py-1.5 text-zinc-200 hover:text-rose-200 transition-colors"
          title="Clear"
          disabled={patch.note === null}
        >
          <Eraser className="w-3 h-3" />
        </button>
        <button
          onClick={onPreview}
          className="inline-flex items-center justify-center rounded-md bg-zinc-700/70 hover:bg-sky-600/60 px-2 py-1.5 text-zinc-200 hover:text-sky-200 transition-colors"
          title="Preview sound"
        >
          <Volume2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
