import { useCallback, useEffect, useRef, useState } from 'react';
import { parseMidiMessage, isNoteOn, isNoteOff, commandName } from '@/lib/midi';
import type { MidiDeviceInfo, MonitorEntry } from '@/lib/types';

interface UseMidiOptions {
  onNoteOn?: (channel: number, note: number, velocity: number, device: string) => void;
  onNoteOff?: (channel: number, note: number, device: string) => void;
  resolvePatch?: (channel: number, note: number) => { id: number; sound: string } | null;
}

export type MidiStatus =
  | 'idle'
  | 'requesting'
  | 'granted'
  | 'denied'
  | 'unsupported'
  | 'error';

export function useMidi(options: UseMidiOptions = {}) {
  const { onNoteOn, onNoteOff, resolvePatch } = options;
  const [status, setStatus] = useState<MidiStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [devices, setDevices] = useState<MidiDeviceInfo[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [monitor, setMonitor] = useState<MonitorEntry[]>([]);
  const [lastMessage, setLastMessage] = useState<MonitorEntry | null>(null);

  const accessRef = useRef<MIDIAccess | null>(null);
  const activeInputRef = useRef<MIDIInput | null>(null);
  const onNoteOnRef = useRef(onNoteOn);
  const onNoteOffRef = useRef(onNoteOff);
  const resolvePatchRef = useRef(resolvePatch);
  const monitorIdRef = useRef(0);

  onNoteOnRef.current = onNoteOn;
  onNoteOffRef.current = onNoteOff;
  resolvePatchRef.current = resolvePatch;

  const refreshDeviceList = useCallback((access: MIDIAccess) => {
    const list: MidiDeviceInfo[] = [];
    access.inputs.forEach((input: MIDIInput) => {
      list.push({
        id: input.id,
        name: input.name || 'Unknown Device',
        manufacturer: input.manufacturer || 'Unknown',
        state: input.state,
        connection: input.connection,
        input,
      });
    });
    setDevices(list);
  }, []);

  const handleEvent = useCallback(
    (e: MIDIMessageEvent) => {
      const input = e.target as MIDIInput;
      const deviceName = input.name || 'Unknown Device';
      if (!e.data) return;
      const parsed = parseMidiMessage(e.data, e.timeStamp);
      if (!parsed) return;

      const on = isNoteOn(parsed);
      const off = isNoteOff(parsed);
      if (!on && !off) return;

      const resolved = resolvePatchRef.current?.(parsed.channel, parsed.data1) ?? null;
      const entry: MonitorEntry = {
        id: monitorIdRef.current++,
        device: deviceName,
        channel: parsed.channel,
        type: commandName(parsed.command, parsed.data2),
        note: parsed.data1,
        velocity: parsed.data2,
        onOff: on ? 'ON' : 'OFF',
        timestamp: parsed.timestamp,
        patch: resolved?.id ?? null,
        sound: resolved?.sound ?? null,
      };
      setLastMessage(entry);
      setMonitor((prev) => [entry, ...prev].slice(0, 60));

      if (on) {
        onNoteOnRef.current?.(parsed.channel, parsed.data1, parsed.data2, deviceName);
      } else {
        onNoteOffRef.current?.(parsed.channel, parsed.data1, deviceName);
      }
    },
    []
  );

  const attachInput = useCallback(
    (input: MIDIInput) => {
      if (activeInputRef.current && activeInputRef.current !== input) {
        activeInputRef.current.onmidimessage = null;
      }
      activeInputRef.current = input;
      input.onmidimessage = handleEvent;
    },
    [handleEvent]
  );

  const selectInput = useCallback(
    (id: string) => {
      setSelectedId(id);
      const device = devices.find((d) => d.id === id);
      if (device) attachInput(device.input);
    },
    [devices, attachInput]
  );

  const requestAccess = useCallback(async () => {
    if (!navigator.requestMIDIAccess) {
      setStatus('unsupported');
      setErrorMsg('Web MIDI API is not supported in this browser. Use Chrome, Edge, or Opera over HTTPS.');
      return;
    }
    setStatus('requesting');
    setErrorMsg(null);
    try {
      const access = await navigator.requestMIDIAccess({ sysex: false });
      accessRef.current = access;
      setStatus('granted');
      refreshDeviceList(access);

      const onChange = () => refreshDeviceList(access);
      access.onstatechange = () => {
        refreshDeviceList(access);
      };
      // also keep selection attached if the device reappears
      void onChange;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (/permission|denied|security/i.test(message)) {
        setStatus('denied');
        setErrorMsg('MIDI permission denied. Allow MIDI access in your browser settings and reconnect.');
      } else {
        setStatus('error');
        setErrorMsg(`MIDI access failed: ${message}`);
      }
    }
  }, [refreshDeviceList]);

  // Re-attach to selected input when the device list changes (reconnect scenario).
  useEffect(() => {
    if (!selectedId) return;
    const device = devices.find((d) => d.id === selectedId);
    if (device && device.state === 'connected') {
      attachInput(device.input);
    } else if (device && device.state === 'disconnected') {
      if (activeInputRef.current) {
        activeInputRef.current.onmidimessage = null;
        activeInputRef.current = null;
      }
    }
  }, [devices, selectedId, attachInput]);

  const refresh = useCallback(() => {
    if (accessRef.current) refreshDeviceList(accessRef.current);
    else void requestAccess();
  }, [refreshDeviceList, requestAccess]);

  const clearMonitor = useCallback(() => {
    setMonitor([]);
    setLastMessage(null);
  }, []);

  const selectedDevice = devices.find((d) => d.id === selectedId) ?? null;
  const connected = !!selectedDevice && selectedDevice.state === 'connected';

  return {
    status,
    errorMsg,
    devices,
    selectedId,
    selectedDevice,
    connected,
    monitor,
    lastMessage,
    requestAccess,
    refresh,
    selectInput,
    clearMonitor,
  };
}
