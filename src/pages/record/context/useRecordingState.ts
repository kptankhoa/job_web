import { useEffect, useState } from 'react';
import RecordRTC from 'recordrtc';
import { RecordingState } from './RecordingState';
import {
  RecordData,
  RECORDING_STATE,
  RECORDING_TYPE,
  SILENCE_COUNTER_LIMIT,
  VAD_STREAM_TIME_SLICE,
  SPEECH_TO_TEXT_WS,
  WS_STATE,
  BlobData
} from '../const';
import {
  checkLegitVAD,
  checkToGetTranscript,
  concatAudioBlob,
  convertToBase64,
  createRecordRTCAudioStream,
  filterByTimestamp,
  sortAscByTimestamp,
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
  const { mapNewStream, stopAllStreamData } = useHandleMediaStream();

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
  const vadSocket = useWebSocket(`${SPEECH_TO_TEXT_WS}/ws/vad`, recordingState, onVadSocketMessage);
  const transcribeSocket = useWebSocket(`${SPEECH_TO_TEXT_WS}/ws/transcribe`, recordingState, onTranscribeSocketMessage);

  const getTranscriptFromRecordData = async (data: RecordData[]) => {
    const audioBlobs = data.map((item) => item.blob);
    const concatenatedBlob = await concatAudioBlob(audioBlobs);
    if (concatenatedBlob && transcribeSocket.getSocket()?.readyState === WS_STATE.OPEN) {
      const id = Date.now();
      setBlobDataMap((oldData) => ({
        ...oldData, [id]: { id, blob: concatenatedBlob, transcript: '' }
      }));
      const convertBase64Callback = (base64: string) => {
        const audioData = {
          id,
          audio_data: base64
        };
        transcribeSocket.getSocket().send(JSON.stringify(audioData));
        setRecordDataList(filterByTimestamp(data, data[data.length - 1].timestamp + 1));
        setSilenceCounter(0);
      };
      convertToBase64(concatenatedBlob, convertBase64Callback);
    } else {
      setRecordDataList(data);
    }
  };

  const handleVADBlobData = (blob: Blob) => {
    const timestamp = Date.now();
    const convertBase64Callback = (base64: string) => {
      const data = {
        id: timestamp,
        audio_data: base64
      };
      if (vadSocket.getSocket()?.readyState === WS_STATE.OPEN) {
        vadSocket.getSocket().send(JSON.stringify(data));
      }
      const newRD: RecordData = {
        timestamp,
        vad: [],
        blob
      };
      setVadPendingAudioMap((oldValue) => ({ ...oldValue, [timestamp]: newRD }));
    };
    convertToBase64(blob, convertBase64Callback);
  };

  useEffect(() => {
    if (!newAudioBlob) {
      return;
    }

    handleVADBlobData(newAudioBlob);
  }, [newAudioBlob]);

  useEffect(() => {
    if (!newRecordData || !checkLegitVAD(newRecordData)) {
      if (silenceCounter >= SILENCE_COUNTER_LIMIT && recordDataList.length) {
        getTranscriptFromRecordData(recordDataList);
      } else {
        setSilenceCounter((oldValue) => oldValue + 1);
      }

      return;
    }
    const newDataSorted = sortAscByTimestamp([...recordDataList, newRecordData]);
    if (checkToGetTranscript(newDataSorted)) {
      getTranscriptFromRecordData(newDataSorted);
    } else {
      setRecordDataList(newDataSorted);
    }
  }, [newRecordData]);

  const initTranscriptAudioStream = () => {
    createRecordRTCAudioStream({
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
    recordRTC?.pauseRecording();
    setRecordingState(RECORDING_STATE.STOPPED);
  };


  const onReset = () => {
    recordRTC?.stopRecording();
    setRecordRTC(null);
    stopAllStreamData();
    setTranscriptData('');
    setRecordingState(RECORDING_STATE.INIT);
    setRecordDataList([]);
    setNewAudioBlob(null);
    setNewRecordData(null);
    setVadPendingAudioMap({});
    setBlobDataMap({});
  };

  return {
    recordingState,
    transcriptData,
    newRecordData,
    blobDataMap,
    setTranscriptData,
    onRecord,
    onPause,
    onStop,
    onReset,
  };
};

export default useRecordingState;
