import { Grid3x3 } from 'lucide-react';
import type { Patch } from '@/lib/types';
import { PatchCard } from './PatchCard';

interface Props {
  patches: Patch[];
  learnTarget: { patchId: number } | null;
  lastHitPatchId: number | null;
  onLearn: (id: number) => void;
  onEdit: (id: number) => void;
  onClear: (id: number) => void;
  onPreview: (id: number) => void;
}

export function PatchGrid({
  patches,
  learnTarget,
  lastHitPatchId,
  onLearn,
  onEdit,
  onClear,
  onPreview,
}: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Grid3x3 className="w-5 h-5 text-sky-400" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-zinc-200">
            Patch Grid · 16 Patches
          </h2>
        </div>
        <span className="text-xs text-zinc-500">
          {patches.filter((p) => p.note !== null).length}/16 mapped
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {patches.map((patch) => (
          <PatchCard
            key={patch.id}
            patch={patch}
            learning={learnTarget?.patchId === patch.id}
            lastHit={lastHitPatchId === patch.id}
            onLearn={() => onLearn(patch.id)}
            onEdit={() => onEdit(patch.id)}
            onClear={() => onClear(patch.id)}
            onPreview={() => onPreview(patch.id)}
          />
        ))}
      </div>
    </section>
  );
}
