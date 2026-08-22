import { useCallback, useEffect, useRef, useState } from 'react';
import { audioEngine } from '@/lib/audio';
import type { Patch } from '@/lib/types';
import { exportPatches, importPatches } from '@/lib/storage';
import { useMidi } from '@/hooks/useMidi';
import { usePatches } from '@/hooks/usePatches';
import { Toolbar } from '@/components/Toolbar';
import { DevicePanel } from '@/components/DevicePanel';
import { MidiMonitor } from '@/components/MidiMonitor';
import { TestPanel } from '@/components/TestPanel';
import { PatchGrid } from '@/components/PatchGrid';
import { EditPatchModal } from '@/components/EditPatchModal';
import { ConflictModal } from '@/components/ConflictModal';

const AUDIO_EXTENSIONS = [
  '.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.weba', '.webm',
  '.mp4', '.mov', '.avi', '.opus',
];

function isAudioFile(file: File): boolean {
  if (file.type.startsWith('audio/') || file.type.startsWith('video/')) return true;
  const name = file.name.toLowerCase();
  return AUDIO_EXTENSIONS.some((ext) => name.endsWith(ext));
}

function isJsonFile(file: File): boolean {
  if (file.type === 'application/json') return true;
  return file.name.toLowerCase().endsWith('.json');
}

function App() {
  const [audioReady, setAudioReady] = useState(false);
  const [editingPatch, setEditingPatch] = useState<Patch | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const {
    kits,
    selectedKitId,
    patches,
    learnTarget,
    conflict,
    pendingNote,
    lastHitPatchId,
    resolvePatch,
    handleNoteOn,
    handleNoteOff,
    startLearn,
    cancelLearn,
    resolveConflict,
    updatePatch,
    clearPatch,
    switchKit,
    resetAll,
    importAll,
    saveNow,
  } = usePatches();

  // Keep a ref to patches so the async audio callback always sees the latest
  // mappings without recreating the callback (which would re-attach MIDI listeners).
  const patchesRef = useRef(patches);
  patchesRef.current = patches;

  // Trigger audio on mapped note-on.
  const onNoteOn = useCallback(
    (channel: number, note: number, velocity: number) => {
      void audioEngine.ensure().then(() => {
        if (!audioEngine.ready) setAudioReady(true);
        const patch = patchesRef.current.find(
          (p) => p.note === note && p.channel === channel && p.enabled
        );
        if (!patch) return;
        const key = `${patch.id}`;
        audioEngine.trigger(
          patch.sound,
          velocity,
          patch.volume,
          patch.playbackMode,
          key,
          undefined,
          patch.sampleKey
        );
      });
      handleNoteOn(channel, note, velocity);
    },
    [handleNoteOn]
  );

  const onNoteOff = useCallback(
    (channel: number, note: number) => {
      const patch = patchesRef.current.find(
        (p) => p.note === note && p.channel === channel && p.enabled
      );
      if (patch && patch.playbackMode === 'hold') {
        audioEngine.release(`${patch.id}`);
      }
      handleNoteOff(channel, note);
    },
    [handleNoteOff]
  );

  const midi = useMidi({ onNoteOn, onNoteOff, resolvePatch });

  // Initialize audio engine on first user gesture (Connect button) and keep it alive.
  const initAudio = useCallback(async () => {
    await audioEngine.ensure();
    setAudioReady(audioEngine.ready);
  }, []);

  const handleConnect = useCallback(async () => {
    await initAudio();
    midi.requestAccess();
  }, [initAudio, midi]);

  // Auto-request MIDI access on mount (some browsers allow it without gesture).
  useEffect(() => {
    void midi.requestAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  }, []);

  const handleSave = useCallback(() => {
    const ok = saveNow();
    showToast(ok ? 'Mappings and kit saved locally.' : 'Save failed.');
  }, [saveNow, showToast]);

  const handleReset = useCallback(() => {
    resetAll();
    showToast('Mappings reset to kit defaults.');
  }, [resetAll, showToast]);

  const handleExport = useCallback(() => {
    const blob = new Blob([exportPatches(patches)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'midi-drum-pad-mapping.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Mapping exported.');
  }, [patches, showToast]);

  const handleImport = useCallback(
    async (file: File) => {
      if (isJsonFile(file)) {
        try {
          const text = await file.text();
          const imported = importPatches(text);
          importAll(imported);
          showToast('Mapping imported.');
        } catch (e) {
          showToast(e instanceof Error ? e.message : 'Import failed.');
        }
        return;
      }
      if (isAudioFile(file)) {
        try {
          await initAudio();
          const key = `library-${Date.now()}-${file.name}`;
          await audioEngine.loadSample(key, file);
          showToast(`Sample loaded: ${file.name}. Assign it via Edit Patch.`);
        } catch {
          showToast('Could not decode this audio file.');
        }
        return;
      }
      showToast('Unsupported file type. Use JSON mappings or audio files.');
    },
    [importAll, showToast, initAudio]
  );

  const handleTestAudio = useCallback(async () => {
    await initAudio();
    audioEngine.trigger('snare', 110, 0.9, 'oneshot', 'test');
    showToast('Audio test triggered.');
  }, [initAudio, showToast]);

  const handlePreview = useCallback(
    async (id: number) => {
      await initAudio();
      const patch = patches.find((p) => p.id === id);
      if (!patch) return;
      audioEngine.trigger(
        patch.sound,
        110,
        patch.volume,
        'oneshot',
        `preview-${id}`,
        undefined,
        patch.sampleKey
      );
    },
    [initAudio, patches]
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              MIDI Drum Pad <span className="text-sky-400">Prototype</span>
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              Real-time Web MIDI connection, note learning &amp; 16-patch mapping.
            </p>
          </div>
          {learnTarget && (
            <div className="flex items-center gap-3 rounded-full bg-amber-500/15 border border-amber-500/30 px-4 py-2">
              <span className="flex items-center gap-2 text-sm text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Learning Patch {learnTarget.patchId} — press a pad...
              </span>
              <button
                onClick={cancelLearn}
                className="text-xs text-amber-200 hover:text-amber-100 underline"
              >
                cancel
              </button>
            </div>
          )}
        </header>

        <Toolbar
          audioReady={audioReady}
          kits={kits}
          selectedKitId={selectedKitId}
          onSave={handleSave}
          onReset={handleReset}
          onExport={handleExport}
          onImport={handleImport}
          onTestAudio={handleTestAudio}
          onSwitchKit={switchKit}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <DevicePanel
            status={midi.status}
            errorMsg={midi.errorMsg}
            devices={midi.devices}
            selectedId={midi.selectedId}
            selectedDevice={midi.selectedDevice}
            connected={midi.connected}
            onConnect={handleConnect}
            onRefresh={midi.refresh}
            onSelect={midi.selectInput}
          />
          <TestPanel
            lastMessage={midi.lastMessage}
            connected={midi.connected}
            deviceName={midi.selectedDevice?.name ?? null}
            waitingForMessages={midi.connected && midi.monitor.length === 0}
          />
        </div>

        <MidiMonitor monitor={midi.monitor} onClear={midi.clearMonitor} />

        <PatchGrid
          patches={patches}
          learnTarget={learnTarget}
          lastHitPatchId={lastHitPatchId}
          onLearn={startLearn}
          onEdit={(id) => setEditingPatch(patches.find((p) => p.id === id) ?? null)}
          onClear={clearPatch}
          onPreview={handlePreview}
        />

        <footer className="text-center text-xs text-zinc-600 pt-2 pb-6">
          Web MIDI API · Web Audio synthesis · {patches.filter((p) => p.note !== null).length}/16 patches mapped
        </footer>
      </div>

      <EditPatchModal
        patch={editingPatch}
        onClose={() => setEditingPatch(null)}
        onSave={updatePatch}
      />
      <ConflictModal conflict={conflict} onResolve={resolveConflict} />

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-zinc-800 border border-white/10 px-4 py-2 text-sm text-zinc-100 shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
