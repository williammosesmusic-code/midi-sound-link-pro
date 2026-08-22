import { useEffect, useRef, useState } from 'react';
import { Music, X } from 'lucide-react';
import type { Patch } from '@/lib/types';
import { DRUM_SOUNDS, audioEngine } from '@/lib/audio';

interface Props {
  patch: Patch | null;
  onClose: () => void;
  onSave: (id: number, updates: Partial<Patch>) => void;
}

export function EditPatchModal({ patch, onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [sound, setSound] = useState<Patch['sound']>('kick');
  const [volume, setVolume] = useState(0.8);
  const [velocity, setVelocity] = useState(100);
  const [enabled, setEnabled] = useState(true);
  const [playbackMode, setPlaybackMode] = useState<'oneshot' | 'hold'>('oneshot');
  const [note, setNote] = useState<number | null>(null);
  const [channel, setChannel] = useState<number | null>(null);
  const [sampleKey, setSampleKey] = useState<string | null>(null);
  const [sampleName, setSampleName] = useState<string | null>(null);
  const [useSample, setUseSample] = useState(false);
  const [loadingSample, setLoadingSample] = useState(false);
  const [sampleError, setSampleError] = useState<string | null>(null);
  const sampleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!patch) return;
    setName(patch.name);
    setSound(patch.sound);
    setVolume(patch.volume);
    setVelocity(patch.velocity);
    setEnabled(patch.enabled);
    setPlaybackMode(patch.playbackMode);
    setNote(patch.note);
    setChannel(patch.channel);
    setSampleKey(patch.sampleKey);
    setSampleName(patch.sampleName);
    setUseSample(!!patch.sampleKey);
    setSampleError(null);
  }, [patch]);

  if (!patch) return null;

  const handleLoadSample = async (file: File) => {
    setLoadingSample(true);
    setSampleError(null);
    try {
      const key = `patch-${patch.id}-${file.name}`;
      await audioEngine.loadSample(key, file);
      setSampleKey(key);
      setSampleName(file.name);
      setUseSample(true);
    } catch {
      setSampleError('Could not decode this file. Try mp3, wav, ogg, or m4a.');
    } finally {
      setLoadingSample(false);
    }
  };

  const handleClearSample = () => {
    if (sampleKey) audioEngine.clearSample(sampleKey);
    setSampleKey(null);
    setSampleName(null);
    setUseSample(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-zinc-100">
            Edit Patch {patch.id}
          </h3>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <Field label="Patch Name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-zinc-800 border border-white/10 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
          </Field>

          <Field label="Sound Source">
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setUseSample(false)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  !useSample
                    ? 'bg-sky-500 text-white'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                Synth Sound
              </button>
              <button
                onClick={() => setUseSample(!!sampleKey)}
                disabled={!sampleKey}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors disabled:opacity-40 ${
                  useSample
                    ? 'bg-emerald-500 text-white'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                Custom Sample
              </button>
            </div>
            {useSample && sampleName ? (
              <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-2">
                <span className="flex items-center gap-2 text-sm text-emerald-300 truncate">
                  <Music className="w-4 h-4 shrink-0" />
                  {sampleName}
                </span>
                <button
                  onClick={handleClearSample}
                  className="text-xs text-rose-300 hover:text-rose-200 shrink-0 ml-2"
                >
                  Remove
                </button>
              </div>
            ) : (
              <select
                value={sound}
                onChange={(e) => setSound(e.target.value as Patch['sound'])}
                className="w-full rounded-lg bg-zinc-800 border border-white/10 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              >
                {DRUM_SOUNDS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            )}
          </Field>

          <Field label="Load Custom Sample (mp3, wav, ogg, m4a, mp4...)">
            <div className="flex gap-2">
              <button
                onClick={() => sampleInputRef.current?.click()}
                disabled={loadingSample}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-3 py-2 text-sm text-zinc-200 disabled:opacity-50"
              >
                <Music className="w-4 h-4 text-emerald-400" />
                {loadingSample ? 'Decoding...' : 'Choose Audio File'}
              </button>
              <input
                ref={sampleInputRef}
                type="file"
                accept="audio/*,video/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleLoadSample(f);
                  e.target.value = '';
                }}
              />
            </div>
            {sampleError && (
              <p className="mt-1.5 text-xs text-rose-300">{sampleError}</p>
            )}
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label={`Volume · ${Math.round(volume * 100)}%`}>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-sky-500"
              />
            </Field>
            <Field label={`Default Vel · ${velocity}`}>
              <input
                type="range"
                min={1}
                max={127}
                step={1}
                value={velocity}
                onChange={(e) => setVelocity(Number(e.target.value))}
                className="w-full accent-sky-500"
              />
            </Field>
          </div>

          <Field label="Playback Mode">
            <div className="flex gap-2">
              {(['oneshot', 'hold'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setPlaybackMode(m)}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    playbackMode === m
                      ? 'bg-sky-500 text-white'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {m === 'oneshot' ? 'One-shot' : 'Hold (Note OFF stops)'}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="MIDI Note (manual)">
              <input
                type="number"
                min={0}
                max={127}
                value={note ?? ''}
                onChange={(e) =>
                  setNote(e.target.value === '' ? null : Math.max(0, Math.min(127, Number(e.target.value))))
                }
                className="w-full rounded-lg bg-zinc-800 border border-white/10 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              />
            </Field>
            <Field label="Channel (manual)">
              <input
                type="number"
                min={1}
                max={16}
                value={channel ?? ''}
                onChange={(e) =>
                  setChannel(
                    e.target.value === '' ? null : Math.max(1, Math.min(16, Number(e.target.value)))
                  )
                }
                className="w-full rounded-lg bg-zinc-800 border border-white/10 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              />
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="accent-sky-500"
            />
            Enabled
          </label>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-200"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(patch.id, {
                name,
                sound,
                volume,
                velocity,
                enabled,
                playbackMode,
                note,
                channel,
                sampleKey: useSample ? sampleKey : null,
                sampleName: useSample ? sampleName : null,
              });
              onClose();
            }}
            className="flex-1 rounded-lg bg-sky-500 hover:bg-sky-400 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Save Patch
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-zinc-400 mb-1.5">{label}</div>
      {children}
    </div>
  );
}
