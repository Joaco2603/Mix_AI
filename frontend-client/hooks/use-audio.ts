import { useEffect, useRef, useState } from "react";

export function useAudio(isActive: boolean) {
  const [micSupported, setMicSupported] = useState(false);
  const [micPermission, setMicPermission] = useState<"granted" | "denied" | "prompt">("prompt");
  const [volume, setVolume] = useState(0);

  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    setMicSupported(!!navigator.mediaDevices?.getUserMedia);

    if (navigator.permissions) {
      navigator.permissions.query({ name: "microphone" as PermissionName }).then((result) => {
        setMicPermission(result.state as any);
        result.onchange = () => setMicPermission(result.state as any);
      }).catch(() => setMicPermission("prompt"));
    }
  }, []);

  useEffect(() => {
    if (!isActive || micPermission !== "granted") {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      return;
    }

    let animationFrameId: number;

    async function setup() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        function updateVolume() {
          analyser.getByteTimeDomainData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const normalized = (dataArray[i] - 128) / 128;
            sum += normalized * normalized;
          }
          const rms = Math.sqrt(sum / dataArray.length);
          setVolume(rms);
          animationFrameId = requestAnimationFrame(updateVolume);
        }

        updateVolume();
      } catch {
        setVolume(0);
      }
    }

    setup();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [isActive, micPermission]);

  return { micSupported, micPermission, volume };
}