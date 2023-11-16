import { useEffect, useRef, useState } from 'react';
import RecordRTC from 'recordrtc';
import { RecordingState } from './RecordingState';
import {
  RecordData,
  RECORDING_STATE,
  VAD_STREAM_TIME_SLICE,
  SPEECH_TO_TEXT_WS,
  WS_STATE,
  BlobData,
  NON_SPEECH_THRESHOLD,
  PRE_SPEECH_BUFFER,
  POST_SPEECH_BUFFER,
  UNIT,
  VAD_DELAY,
  MIN_AUDIO_UNIT,
  PAUSE_TIME
} from '../const';
import {
  splitAudioBlob,
  concatAudioBlob,
  convertToBase64,
  createMicRecordRTCAudioStream,
  createNewRecordRTCFromStream
} from '../util/recording.util';
import { useHandleMediaStream, useWebSocket } from '../hook';

const useRecordingState = (): RecordingState => {
  const [recordingState, setRecordingState] = useState<RECORDING_STATE>(RECORDING_STATE.INIT);
  const [recordRTC, setRecordRTC] = useState<RecordRTC | null>(null);
  const [recordDataList, setRecordDataList] = useState<RecordData[]>([]);
  const [newRecordData, setNewRecordData] = useState<RecordData | null>(null);
  const [newAudioBlob, setNewAudioBlob] = useState<Blob | null>(null);
  const [, setVadPendingAudioMap] = useState<{[key: string]: RecordData}>({});
  const [transcriptData, setTranscriptData] = useState<string>('');
  const [silenceCounter, setSilenceCounter] = useState<number>(0);
  const [blobDataMap, setBlobDataMap] = useState<{ [key: string]: BlobData }>({});
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [blobBuffers, setBlobBuffers] = useState<Blob[]>([]);
  const zeroSpanLength = useRef<number>(0);
  const isSpeech = useRef<boolean>(false);
  const containsSpeech = useRef<boolean>(false);
  const { mapNewStream, stopAllMediaStream } = useHandleMediaStream();

  const onVadSocketMessage = (e: MessageEvent) => {
    setVadPendingAudioMap((oldValue) => {
      const data = JSON.parse(e.data);
      const updatingData = oldValue[data.id];
      const newRD: RecordData = {
        ...updatingData,
        vad: data.vad_res
      };
      setNewRecordData(newRD);
      delete oldValue[data.id];

      return oldValue;
    });
  };

  const onTranscribeSocketMessage = (e: MessageEvent) => {
    setRecordingState((value: RECORDING_STATE) => {
      const data = JSON.parse(e.data);
      const newTranscript = data.sentences?.map((el: any) => el.text).join(' ') || '';
      setTranscriptData((oldData) => oldData.concat((oldData && newTranscript) ? '\n' : '', newTranscript));
      setBlobDataMap((oldData) => ({
        ...oldData, [data.id]: { ...oldData[data.id], transcript: newTranscript }
      }));

      return value;
    });
  };

  const vadSocket = useWebSocket({
    endpoint: `${SPEECH_TO_TEXT_WS}/ws/vad`,
    recordingState,
    messageHandler: onVadSocketMessage
  });
  const transcribeSocket = useWebSocket({
    endpoint: `${SPEECH_TO_TEXT_WS}/ws/transcribe`,
    recordingState,
    messageHandler: onTranscribeSocketMessage
  });

  // const getTranscriptFromRecordData = async (data: RecordData[]) => {
  //   const audioBlobs = data.map((item) => item.blob);
  //   const concatenatedBlob = await concatAudioBlob(audioBlobs);
  //   if (concatenatedBlob && transcribeSocket.getSocket()?.readyState === WS_STATE.OPEN) {
  //     const id = Date.now();
  //     setBlobDataMap((oldData) => ({
  //       ...oldData, [id]: { id, blob: concatenatedBlob, transcript: '' }
  //     }));
  //     const convertBase64Callback = (base64: string) => {
  //       const audioData = {
  //         id,
  //         audio_data: base64
  //       };
  //       transcribeSocket.send(audioData);
  //       setRecordDataList(filterByTimestamp(data, data[data.length - 1].timestamp + 1));
  //       setSilenceCounter(0);
  //     };
  //     convertToBase64(concatenatedBlob, convertBase64Callback);
  //   } else {
  //     setRecordDataList(data);
  //   }
  // };

  const getTranscribeFromBlobs = async (blobs: Blob[]) => {
    const concatenatedBlob = await concatAudioBlob(blobs);
    if (concatenatedBlob && transcribeSocket.getSocket()?.readyState === WS_STATE.OPEN) {
      const id = Date.now();
      setBlobDataMap((oldData) => ({
        ...oldData, [id]: { id, blob: concatenatedBlob, transcript: null }
      }));
      const convertBase64Callback = (base64: string) => {
        const audioData = {
          id,
          audio_data: base64
        };
        transcribeSocket.send(audioData);
      };
      convertToBase64(concatenatedBlob, convertBase64Callback);
    }
  };

  const handleVADBlobData = (blob: Blob) => {
    const timestamp = Date.now();
    const convertBase64Callback = (base64: string) => {
      const data = {
        id: timestamp,
        audio_data: base64
      };
      vadSocket.send(data);
      const newRD: RecordData = {
        timestamp,
        vad: [],
        blob
      };
      setVadPendingAudioMap((oldValue) => ({ ...oldValue, [timestamp]: newRD }));
    };
    convertToBase64(blob, convertBase64Callback);
  };

  const handleNewRecordData = async (newRD: RecordData) => {
    const audioBlob = newRD.blob;
    const vadResult = newRD.vad || [];
    const splitBlobs = await splitAudioBlob(audioBlob);
    const loopLength = Math.min(splitBlobs.length, vadResult.length);
    setBlobBuffers((buffers) => {
      const newBuffers = [...buffers];
      
      for (let i = 0; i <= loopLength; i++) {
        newBuffers.push(splitBlobs[i]);
        if (vadResult[i] === 0) {
          zeroSpanLength.current = zeroSpanLength.current + 1;
          if (isSpeech.current) {
            isSpeech.current = false;
          }
          if (containsSpeech.current) {
            if (zeroSpanLength.current > NON_SPEECH_THRESHOLD) {
              if (newBuffers.length >  MIN_AUDIO_UNIT) {
                console.log(newBuffers.length);
                console.log(zeroSpanLength.current);
                // speech_span = self.speech_buff[:-self.unit * (self.zero_span_length - self.post_speech_buffer)]
                const postSpeechBuffer = newBuffers.slice(PRE_SPEECH_BUFFER + VAD_DELAY);
                const speechSpan = newBuffers.slice(0, -(zeroSpanLength.current - POST_SPEECH_BUFFER));
                if (speechSpan.length) {
                  getTranscribeFromBlobs(speechSpan);
                }
                newBuffers.length = 0;
                newBuffers.push(...postSpeechBuffer);
                containsSpeech.current = false;
              }
            }
          } else {
            if (newBuffers.length > PRE_SPEECH_BUFFER + VAD_DELAY) {
              const postSpeechBuffer = newBuffers.slice(-(PRE_SPEECH_BUFFER + VAD_DELAY));
              newBuffers.length = 0;
              newBuffers.push(...postSpeechBuffer);
            }
          }
        } else {
          if (!isSpeech.current) {
            isSpeech.current = true;
            containsSpeech.current = true;
            zeroSpanLength.current = 0;
          }
        }
      }

      return newBuffers;
    });
  };

  useEffect(() => {
    if (!newAudioBlob) {
      return;
    }

    handleVADBlobData(newAudioBlob);
  }, [newAudioBlob]);

  useEffect(() => {
    if (!newRecordData?.blob) {
      return;
    }
    handleNewRecordData(newRecordData);
  }, [newRecordData]);

  const initTranscriptAudioStream = () => {
    createMicRecordRTCAudioStream({
      attributes: {
        timeSlice: VAD_STREAM_TIME_SLICE,
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

  const onUpload = (url: string) => {
    const audio = new Audio(url);
    const ctx = new window.AudioContext();
    const stream_dest = ctx.createMediaStreamDestination();
    const source = ctx.createMediaElementSource(audio);
    source.connect(stream_dest);

    const stream = stream_dest.stream;
    createNewRecordRTCFromStream(stream, {
      attributes: {
        timeSlice: VAD_STREAM_TIME_SLICE,
        ondataavailable: setNewAudioBlob
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

  const onReset = () => {
    recordRTC?.stopRecording();
    setRecordRTC(null);
    stopAllMediaStream();
    setTranscriptData('');
    setRecordingState(RECORDING_STATE.INIT);
    setRecordDataList([]);
    setNewAudioBlob(null);
    setNewRecordData(null);
    setVadPendingAudioMap({});
    setBlobDataMap({});
    setRecordedBlob(null);
  };

  return {
    recordingState,
    transcriptData,
    blobDataMap,
    recordedBlob,
    setTranscriptData,
    onUpload,
    onRecord,
    onPause,
    onStop,
    onReset,
  };
};

export default useRecordingState;
