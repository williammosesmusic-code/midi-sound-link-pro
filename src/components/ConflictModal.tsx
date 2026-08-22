import { AlertTriangle } from 'lucide-react';
import type { DuplicateConflict } from '@/hooks/usePatches';

interface Props {
  conflict: DuplicateConflict | null;
  onResolve: (decision: 'replace' | 'cancel' | 'duplicate') => void;
}

export function ConflictModal({ conflict, onResolve }: Props) {
  if (!conflict) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-amber-500/30 bg-zinc-900 p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full bg-amber-500/20 p-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-base font-semibold text-zinc-100">Duplicate MIDI Note</h3>
        </div>
        <p className="text-sm text-zinc-300 mb-5">
          MIDI Note <span className="font-mono text-amber-300">{conflict.note}</span> on
          channel <span className="font-mono text-amber-300">{conflict.channel}</span> is
          already assigned to{' '}
          <span className="font-semibold text-amber-300">Patch {conflict.existingPatchId}</span>.
        </p>
        <div className="space-y-2">
          <button
            onClick={() => onResolve('replace')}
            className="w-full rounded-lg bg-sky-500 hover:bg-sky-400 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Replace existing assignment
          </button>
          <button
            onClick={() => onResolve('duplicate')}
            className="w-full rounded-lg bg-zinc-700 hover:bg-zinc-600 px-4 py-2.5 text-sm font-medium text-zinc-200"
          >
            Allow duplicate
          </button>
          <button
            onClick={() => onResolve('cancel')}
            className="w-full rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
