import { useEffect, useState } from 'react';
import RecordRTC from 'recordrtc';
import { RecordingState } from './RecordingState';
import {
  API_SENME_PLUGIN_WSS,
  RECORDING_STATE,
} from '../const';
import {
  convertToBase64, createMicRecordRTCAudioStream, createNewRecordRTCFromStream
} from '../util/recording.util';
import { useHandleMediaStream, useWebSocket } from '../hook';

const useRecordingStateStream = (): RecordingState => {
  const [recordingState, setRecordingState] = useState<RECORDING_STATE>(RECORDING_STATE.INIT);
  const [recordRTC, setRecordRTC] = useState<RecordRTC | null>(null);
  const [newAudioBlob, setNewAudioBlob] = useState<Blob | null>(null);
  const [transcriptData, setTranscriptData] = useState<string>('');
  const [, setFinishedTexts] = useState<{[key: string]: string}>({});
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const { mapNewStream, stopAllMediaStream } = useHandleMediaStream();

  const onTranscribeSocketMessage = (e: MessageEvent) => {
    setRecordingState((value: RECORDING_STATE) => {
      if (value === RECORDING_STATE.RECORDING) {
        const data = JSON.parse(e.data);
        if (data.type === 'result') {
          const { id, text, isFinal } = data;
          setFinishedTexts((oldValue) => {
            const newValue = { ...oldValue };
            if (isFinal) {
              newValue[id] = text;
            }
            const updatedTranscript = Object.entries(newValue)
              .sort((a, b) => +a[0] - +b[0])
              .map((item) => item[1])
              .join('\n')
              .concat(isFinal ? '' : `\n${text}`)
              .trim();
            setTranscriptData(updatedTranscript);

            return newValue;
          });
        }
      }

      return value;
    });
  };

  const sttSocket = useWebSocket({
    endpoint: `${API_SENME_PLUGIN_WSS}/draid-stt`,
    recordingState,
    messageHandler: onTranscribeSocketMessage,
    onOpen: (s: WebSocket) => {
      const data = {
        type: 'start_recognize',
        lang: 'en-US'
      };
      s.send(JSON.stringify(data));
    }
  });

  const handleNewBlobData = (blob: Blob) => {
    const convertBase64Callback = (base64: string) => {
      const data = {
        type: 'audio_chunk',
        base64String: base64
      };
      sttSocket.send(data);
    };
    convertToBase64(blob, convertBase64Callback);
  };

  useEffect(() => {
    if (!newAudioBlob) {
      return;
    }

    handleNewBlobData(newAudioBlob);
  }, [newAudioBlob]);

  const initTranscriptAudioStream = () => {
    createMicRecordRTCAudioStream({
      attributes: {
        timeSlice: 100,
        numberOfAudioChannels: 1,
        bitsPerSecond: 128000,
        ondataavailable: setNewAudioBlob
      },
      setRecordRTC,
      mapNewStream
    });
  };

  const onRecord = () => {
    if (recordRTC) {
      recordRTC.resumeRecording();
    } else {
      initTranscriptAudioStream();
    }
    setRecordingState(RECORDING_STATE.RECORDING);
  };

  const onUpload = (url: string) => {
    const audio = new Audio(url);
    const ctx = new window.AudioContext();
    const stream_dest = ctx.createMediaStreamDestination();
    const source = ctx.createMediaElementSource(audio);
    source.connect(stream_dest);

    const stream = stream_dest.stream;
    createNewRecordRTCFromStream(stream, {
      attributes: {
        timeSlice: 100,
        ondataavailable: setNewAudioBlob,
        numberOfAudioChannels: 1,
        bitsPerSecond: 128000,
      },
      setRecordRTC,
      mapNewStream
    });
    audio.play();
    audio.onended = () => {
      audio.pause();
      audio.remove();
      onStop();
    };
    setRecordingState(RECORDING_STATE.RECORDING);
  };

  const onPause = () => {
    recordRTC?.pauseRecording();
    setRecordingState(RECORDING_STATE.PAUSED);
  };

  const onStop = () => {
    setRecordRTC((value) => {
      if (value) {
        value?.stopRecording(() => {
          const newBlob = value.getBlob();
          setRecordedBlob(newBlob);
        });
      }

      return value;
    });
    stopAllMediaStream();
    setRecordingState(RECORDING_STATE.STOPPED);
  };

  const onGenerateReport = () => {
    setRecordingState(RECORDING_STATE.GENERATING_REPORT);
  };

  const onReset = () => {
    recordRTC?.stopRecording();
    setRecordRTC(null);
    stopAllMediaStream();
    setTranscriptData('');
    setRecordingState(RECORDING_STATE.INIT);
    setNewAudioBlob(null);
    setFinishedTexts({});
  };

  return {
    blobDataMap: {},
    onStop,
    onUpload,
    recordedBlob,
    recordingState,
    transcriptData,
    setTranscriptData,
    onRecord,
    onPause,
    onReset
  };
};

export default useRecordingStateStream;
