// Drum sample definitions + Web Audio synthesis engine.

export type DrumSoundId =
  | 'kick'
  | 'snare'
  | 'closed-hat'
  | 'open-hat'
  | 'clap'
  | 'tom-low'
  | 'tom-mid'
  | 'tom-high'
  | 'crash'
  | 'ride'
  | 'rim'
  | 'cowbell'
  | 'tambourine'
  | 'splash'
  | 'china'
  | 'conga-low'
  | 'conga-mid'
  | 'conga-high'
  | 'cabasa'
  | 'maracas'
  | 'claves'
  | 'woodblock-low'
  | 'woodblock-high'
  | 'triangle'
  | 'bongo-low'
  | 'bongo-high'
  | 'timbale-low'
  | 'timbale-high'
  | 'agogo-low'
  | 'agogo-high'
  | 'guiro'
  | 'whistle';

export interface DrumSound {
  id: DrumSoundId;
  label: string;
}

export const DRUM_SOUNDS: DrumSound[] = [
  { id: 'kick', label: 'Kick' },
  { id: 'snare', label: 'Snare' },
  { id: 'closed-hat', label: 'Closed Hat' },
  { id: 'open-hat', label: 'Open Hat' },
  { id: 'clap', label: 'Clap' },
  { id: 'tom-low', label: 'Tom Low' },
  { id: 'tom-mid', label: 'Tom Mid' },
  { id: 'tom-high', label: 'Tom High' },
  { id: 'crash', label: 'Crash' },
  { id: 'ride', label: 'Ride' },
  { id: 'rim', label: 'Rim Shot' },
  { id: 'cowbell', label: 'Cowbell' },
  { id: 'tambourine', label: 'Tambourine' },
  { id: 'splash', label: 'Splash' },
  { id: 'china', label: 'China' },
  { id: 'conga-low', label: 'Conga Low' },
  { id: 'conga-mid', label: 'Conga Mid' },
  { id: 'conga-high', label: 'Conga High' },
  { id: 'cabasa', label: 'Cabasa' },
  { id: 'maracas', label: 'Maracas' },
  { id: 'claves', label: 'Claves' },
  { id: 'woodblock-low', label: 'Woodblock Low' },
  { id: 'woodblock-high', label: 'Woodblock High' },
  { id: 'triangle', label: 'Triangle' },
  { id: 'bongo-low', label: 'Bongo Low' },
  { id: 'bongo-high', label: 'Bongo High' },
  { id: 'timbale-low', label: 'Timbale Low' },
  { id: 'timbale-high', label: 'Timbale High' },
  { id: 'agogo-low', label: 'Agogo Low' },
  { id: 'agogo-high', label: 'Agogo High' },
  { id: 'guiro', label: 'Guiro' },
  { id: 'whistle', label: 'Whistle' },
];

export const DEFAULT_PATCH_SOUNDS: DrumSoundId[] = [
  'kick', 'snare', 'closed-hat', 'open-hat', 'clap', 'tom-low', 'tom-mid', 'tom-high',
  'crash', 'ride', 'rim', 'cowbell', 'tambourine', 'splash', 'china', 'conga-low',
];

// 10 default kits: each defines a name + 16 default sound assignments.
export interface KitPreset {
  id: string;
  name: string;
  sounds: DrumSoundId[];
}

const K = (...s: DrumSoundId[]) => s;

export const KIT_PRESETS: KitPreset[] = [
  {
    id: 'standard',
    name: 'Standard Kit',
    sounds: K('kick', 'snare', 'closed-hat', 'open-hat', 'clap', 'tom-low', 'tom-mid', 'tom-high',
      'crash', 'ride', 'rim', 'cowbell', 'tambourine', 'splash', 'china', 'conga-low'),
  },
  {
    id: 'electronic',
    name: 'Electronic Kit',
    sounds: K('kick', 'snare', 'closed-hat', 'open-hat', 'clap', 'tom-mid', 'rim', 'cowbell',
      'crash', 'ride', 'splash', 'china', 'tambourine', 'conga-high', 'cabasa', 'whistle'),
  },
  {
    id: 'acoustic',
    name: 'Acoustic Kit',
    sounds: K('kick', 'snare', 'closed-hat', 'open-hat', 'clap', 'tom-low', 'tom-mid', 'tom-high',
      'crash', 'ride', 'rim', 'woodblock-low', 'woodblock-high', 'triangle', 'claves', 'guiro'),
  },
  {
    id: 'hiphop',
    name: 'Hip-Hop Kit',
    sounds: K('kick', 'snare', 'closed-hat', 'open-hat', 'clap', 'rim', 'cowbell', 'tambourine',
      'tom-low', 'tom-high', 'splash', 'china', 'cabasa', 'maracas', 'conga-low', 'bongo-low'),
  },
  {
    id: 'rock',
    name: 'Rock Kit',
    sounds: K('kick', 'snare', 'closed-hat', 'open-hat', 'clap', 'tom-low', 'tom-mid', 'tom-high',
      'crash', 'ride', 'splash', 'china', 'rim', 'cowbell', 'tambourine', 'claves'),
  },
  {
    id: 'latin',
    name: 'Latin Kit',
    sounds: K('conga-low', 'conga-mid', 'conga-high', 'bongo-low', 'bongo-high', 'timbale-low', 'timbale-high', 'cowbell',
      'maracas', 'claves', 'guiro', 'cabasa', 'woodblock-low', 'woodblock-high', 'agogo-low', 'agogo-high'),
  },
  {
    id: 'percussion',
    name: 'Percussion Kit',
    sounds: K('tambourine', 'cabasa', 'maracas', 'claves', 'woodblock-low', 'woodblock-high', 'triangle', 'cowbell',
      'agogo-low', 'agogo-high', 'guiro', 'conga-low', 'conga-mid', 'conga-high', 'bongo-low', 'bongo-high'),
  },
  {
    id: 'techno',
    name: 'Techno Kit',
    sounds: K('kick', 'snare', 'closed-hat', 'open-hat', 'clap', 'rim', 'tom-mid', 'tom-high',
      'crash', 'ride', 'splash', 'china', 'cowbell', 'tambourine', 'whistle', 'cabasa'),
  },
  {
    id: 'jazz',
    name: 'Jazz Kit',
    sounds: K('kick', 'snare', 'closed-hat', 'open-hat', 'ride', 'rim', 'tom-low', 'tom-mid',
      'tom-high', 'crash', 'splash', 'cowbell', 'woodblock-low', 'woodblock-high', 'triangle', 'claves'),
  },
  {
    id: 'trap',
    name: 'Trap Kit',
    sounds: K('kick', 'snare', 'closed-hat', 'open-hat', 'clap', 'rim', 'cowbell', 'tambourine',
      'tom-low', 'tom-high', 'splash', 'china', 'cabasa', 'maracas', 'conga-low', 'whistle'),
  },
];

type ActiveVoice = { stop: (releaseTime?: number) => void };

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private activeVoices = new Map<string, ActiveVoice>();
  private noiseBuffer: AudioBuffer | null = null;
  private samples = new Map<string, AudioBuffer>();

  async ensure(): Promise<void> {
    if (this.ctx) {
      if (this.ctx.state !== 'running') await this.ctx.resume();
      return;
    }
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.9;
    this.master.connect(this.ctx.destination);
    this.noiseBuffer = this.makeNoiseBuffer(this.ctx, 1.2);
    if (this.ctx.state !== 'running') await this.ctx.resume();
  }

  get ready(): boolean {
    return !!this.ctx && this.ctx.state === 'running';
  }

  hasSample(key: string): boolean {
    return this.samples.has(key);
  }

  async loadSample(key: string, file: File): Promise<void> {
    await this.ensure();
    const arrayBuf = await file.arrayBuffer();
    const decoded = await this.ctx!.decodeAudioData(arrayBuf);
    this.samples.set(key, decoded);
  }

  clearSample(key: string): void {
    this.samples.delete(key);
  }

  private makeNoiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  private noiseSource(): AudioBufferSourceNode {
    const src = this.ctx!.createBufferSource();
    src.buffer = this.noiseBuffer;
    src.loop = true;
    return src;
  }

  private now(): number {
    return this.ctx!.currentTime;
  }

  trigger(
    sound: DrumSoundId,
    velocity: number,
    volume: number,
    mode: 'oneshot' | 'hold',
    key: string,
    releaseAt?: number,
    sampleKey?: string | null
  ): void {
    if (!this.ctx || !this.master) return;
    const v = Math.max(0, Math.min(1, velocity / 127)) * Math.max(0, Math.min(1, volume));
    if (v <= 0.0001) return;
    this.stopVoice(key, 0.005);
    const voice =
      sampleKey && this.samples.has(sampleKey)
        ? this.playSample(sampleKey, v)
        : this.synth(sound, v);
    if (!voice) return;
    this.activeVoices.set(key, voice);
    if (mode === 'oneshot') {
      const dur = voice.duration ?? 0.4;
      this.stopVoice(key, dur);
    } else if (releaseAt !== undefined) {
      this.stopVoice(key, Math.max(0, releaseAt - this.now()));
    }
  }

  private playSample(sampleKey: string, v: number): ActiveVoice & { duration?: number } {
    const ctx = this.ctx!;
    const out = this.master!;
    const t = this.now();
    const buf = this.samples.get(sampleKey)!;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.setValueAtTime(v, t);
    src.connect(g).connect(out);
    src.start(t);
    const dur = buf.duration;
    return {
      stop: (releaseTime?: number) => {
        const stopAt = releaseTime ?? ctx.currentTime + 0.01;
        try {
          g.gain.cancelScheduledValues(stopAt);
          g.gain.setValueAtTime(g.gain.value, stopAt);
          g.gain.exponentialRampToValueAtTime(0.0001, stopAt + 0.03);
          src.stop(stopAt + 0.04);
        } catch {
          // already stopped
        }
      },
      duration: dur,
    };
  }

  release(key: string): void {
    this.stopVoice(key, 0.06);
  }

  private stopVoice(key: string, delay: number): void {
    const voice = this.activeVoices.get(key);
    if (!voice) return;
    voice.stop(this.now() + delay);
    this.activeVoices.delete(key);
  }

  private synth(sound: DrumSoundId, vel: number): (ActiveVoice & { duration?: number }) | null {
    const ctx = this.ctx!;
    const out = this.master!;
    const t = this.now();
    switch (sound) {
      case 'kick':
        return this.kick(ctx, out, t, vel);
      case 'snare':
        return this.snare(ctx, out, t, vel);
      case 'closed-hat':
        return this.hat(ctx, out, t, vel, 0.05);
      case 'open-hat':
        return this.hat(ctx, out, t, vel, 0.3);
      case 'clap':
        return this.clap(ctx, out, t, vel);
      case 'tom-low':
        return this.tom(ctx, out, t, vel, 90);
      case 'tom-mid':
        return this.tom(ctx, out, t, vel, 125);
      case 'tom-high':
        return this.tom(ctx, out, t, vel, 170);
      case 'crash':
        return this.cymbal(ctx, out, t, vel, 0.8, 4000);
      case 'ride':
        return this.cymbal(ctx, out, t, vel, 0.5, 6000);
      case 'splash':
        return this.cymbal(ctx, out, t, vel, 0.3, 8000);
      case 'china':
        return this.cymbal(ctx, out, t, vel, 0.6, 3000, true);
      case 'rim':
        return this.rim(ctx, out, t, vel);
      case 'cowbell':
        return this.tone(ctx, out, t, vel, 560, 0.18, 'square');
      case 'tambourine':
        return this.shaker(ctx, out, t, vel, 0.18, 0.5);
      case 'conga-low':
        return this.tone(ctx, out, t, vel, 130, 0.25, 'sine');
      case 'conga-mid':
        return this.tone(ctx, out, t, vel, 180, 0.22, 'sine');
      case 'conga-high':
        return this.tone(ctx, out, t, vel, 240, 0.18, 'sine');
      case 'cabasa':
        return this.shaker(ctx, out, t, vel, 0.08, 0.8);
      case 'maracas':
        return this.shaker(ctx, out, t, vel, 0.12, 0.6);
      case 'claves':
        return this.tone(ctx, out, t, vel, 2500, 0.06, 'square');
      case 'woodblock-low':
        return this.tone(ctx, out, t, vel, 800, 0.1, 'square');
      case 'woodblock-high':
        return this.tone(ctx, out, t, vel, 1200, 0.1, 'square');
      case 'triangle':
        return this.tone(ctx, out, t, vel, 3200, 0.5, 'triangle');
      case 'bongo-low':
        return this.tone(ctx, out, t, vel, 200, 0.2, 'sine');
      case 'bongo-high':
        return this.tone(ctx, out, t, vel, 300, 0.18, 'sine');
      case 'timbale-low':
        return this.tom(ctx, out, t, vel, 180);
      case 'timbale-high':
        return this.tom(ctx, out, t, vel, 240);
      case 'agogo-low':
        return this.tone(ctx, out, t, vel, 440, 0.25, 'square');
      case 'agogo-high':
        return this.tone(ctx, out, t, vel, 660, 0.25, 'square');
      case 'guiro':
        return this.guiro(ctx, out, t, vel);
      case 'whistle':
        return this.tone(ctx, out, t, vel, 2000, 0.3, 'sine');
      default:
        return this.tone(ctx, out, t, vel, 220, 0.2, 'sine');
    }
  }

  private kick(ctx: AudioContext, out: GainNode, t: number, v: number) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    g.gain.setValueAtTime(v, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    osc.connect(g).connect(out);
    osc.start(t);
    osc.stop(t + 0.5);
    return { stop: () => {}, duration: 0.45 };
  }

  private snare(ctx: AudioContext, out: GainNode, t: number, v: number) {
    const noise = this.noiseSource();
    const nf = ctx.createBiquadFilter();
    nf.type = 'highpass';
    nf.frequency.value = 1500;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(v * 0.8, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    noise.connect(nf).connect(ng).connect(out);
    noise.start(t);
    noise.stop(t + 0.2);
    const osc = ctx.createOscillator();
    const og = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.1);
    og.gain.setValueAtTime(v * 0.5, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(og).connect(out);
    osc.start(t);
    osc.stop(t + 0.15);
    return { stop: () => {}, duration: 0.2 };
  }

  private hat(ctx: AudioContext, out: GainNode, t: number, v: number, dur: number) {
    const noise = this.noiseSource();
    const f = ctx.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = 7000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(v * 0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    noise.connect(f).connect(g).connect(out);
    noise.start(t);
    noise.stop(t + dur + 0.02);
    return { stop: () => {}, duration: dur };
  }

  private clap(ctx: AudioContext, out: GainNode, t: number, v: number) {
    const offsets = [0, 0.01, 0.02, 0.03];
    let maxEnd = 0;
    offsets.forEach((o, i) => {
      const noise = this.noiseSource();
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = 1200;
      f.Q.value = 1.2;
      const g = ctx.createGain();
      const peak = i === offsets.length - 1 ? v * 0.7 : v * 0.5;
      g.gain.setValueAtTime(peak, t + o);
      g.gain.exponentialRampToValueAtTime(0.001, t + o + 0.1);
      noise.connect(f).connect(g).connect(out);
      noise.start(t + o);
      noise.stop(t + o + 0.12);
      maxEnd = Math.max(maxEnd, o + 0.12);
    });
    return { stop: () => {}, duration: maxEnd };
  }

  private tom(ctx: AudioContext, out: GainNode, t: number, v: number, freq: number) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + 0.3);
    g.gain.setValueAtTime(v, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.connect(g).connect(out);
    osc.start(t);
    osc.stop(t + 0.4);
    return { stop: () => {}, duration: 0.35 };
  }

  private cymbal(
    ctx: AudioContext,
    out: GainNode,
    t: number,
    v: number,
    dur: number,
    hp: number,
    china = false
  ) {
    const noise = this.noiseSource();
    const f = ctx.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = china ? 2000 : hp;
    const g = ctx.createGain();
    g.gain.setValueAtTime(v * 0.4, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    noise.connect(f).connect(g).connect(out);
    noise.start(t);
    noise.stop(t + dur + 0.05);
    return { stop: () => {}, duration: dur };
  }

  private rim(ctx: AudioContext, out: GainNode, t: number, v: number) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1700, t);
    g.gain.setValueAtTime(v * 0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(g).connect(out);
    osc.start(t);
    osc.stop(t + 0.05);
    return { stop: () => {}, duration: 0.05 };
  }

  private tone(
    ctx: AudioContext,
    out: GainNode,
    t: number,
    v: number,
    freq: number,
    dur: number,
    type: OscillatorType
  ) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(v * 0.6, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(g).connect(out);
    osc.start(t);
    osc.stop(t + dur + 0.02);
    return { stop: () => {}, duration: dur };
  }

  private shaker(ctx: AudioContext, out: GainNode, t: number, v: number, dur: number, hp: number) {
    const noise = this.noiseSource();
    const f = ctx.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = 5000 + hp * 3000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(v * 0.5, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    noise.connect(f).connect(g).connect(out);
    noise.start(t);
    noise.stop(t + dur + 0.02);
    return { stop: () => {}, duration: dur };
  }

  private guiro(ctx: AudioContext, out: GainNode, t: number, v: number) {
    const noise = this.noiseSource();
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.setValueAtTime(2000, t);
    f.frequency.linearRampToValueAtTime(800, t + 0.18);
    f.Q.value = 6;
    const g = ctx.createGain();
    g.gain.setValueAtTime(v * 0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    noise.connect(f).connect(g).connect(out);
    noise.start(t);
    noise.stop(t + 0.22);
    return { stop: () => {}, duration: 0.2 };
  }
}

export const audioEngine = new AudioEngine();
