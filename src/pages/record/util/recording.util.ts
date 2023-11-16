import RecordRTC, { StereoAudioRecorder } from 'recordrtc';
import {
  CreateAudioStream,
  LEGIT_VAD_VOICE_DETECTED_CHARACTERS,
  NO_VOICE_DETECTION_CHARACTER,
  NO_VOICE_DETECTION_CHARACTER_OCCURRENCES,
  RecordData
} from '../const';

export const createMicRecordRTCAudioStream = (options: CreateAudioStream) => {
  navigator.mediaDevices.getUserMedia({
    audio: true
  })
    .then((stream: MediaStream) => {
      createNewRecordRTCFromStream(stream, options);
    })
    .catch((error: Error) => {
      options.setRecordRTC(null);
      console.error(JSON.stringify(error));
    });
};

export const createNewRecordRTCFromStream = (stream: MediaStream, { attributes, setRecordRTC, mapNewStream }: CreateAudioStream) => {
  const newStreamId = Date.now().toString();
  const currentRecordAudio = new RecordRTC(stream, {
    type: 'audio',
    mimeType: 'audio/wav',
    recorderType: StereoAudioRecorder,
    desiredSampRate: 16000,
    numberOfAudioChannels: 2,
    ...attributes
  });
  setRecordRTC(currentRecordAudio);
  currentRecordAudio.startRecording();
  mapNewStream(newStreamId, stream);
};

export const sortAscByTimestamp = (data: RecordData[]) => data
  .sort((a, b) => a.timestamp - b.timestamp);

export const filterByTimestamp = (data: RecordData[], goeTimestamp = 0, loeTimeStamp: number = Date.now()) => sortAscByTimestamp(data)
  .filter((item) => item.timestamp >= goeTimestamp && item.timestamp <= loeTimeStamp);

export const checkToGetTranscript = (data: RecordData[]) => {
  const vadData = data.reduce((prev, curr) => [...prev, ...curr.vad], [] as number[]);
  const vadDataStr = vadData.join('');
  const toGetTranscriptStr = NO_VOICE_DETECTION_CHARACTER.repeat(NO_VOICE_DETECTION_CHARACTER_OCCURRENCES);

  return vadDataStr.endsWith(toGetTranscriptStr) || data.length >= 3;
};

export const checkLegitVAD = (data: RecordData) => data.vad.filter((v) => v === 1).length >= LEGIT_VAD_VOICE_DETECTED_CHARACTERS;

const audioContext = new AudioContext();

const getBlobFromChunkData = (left: Float32Array, right: Float32Array) => {
  const interleaved = new Float32Array(left.length + right.length);
  for (let src = 0, dst = 0; src < left.length; src++, dst += 2) {
    interleaved[dst] = left[src];
    interleaved[dst + 1] = right[src];
  }
  const wavBytes = getWavBytes(interleaved.buffer, {
    isFloat: true,
    numChannels: 2,
    sampleRate: 48000
  });

  return new Blob([wavBytes], { type: 'audio/wav' });
};

export const chunkAudioToBlobs = (
  buffer: { left: Float32Array, right: Float32Array},
  chunkSize: number
): Blob[] => {
  const { left, right } = buffer;

  const chunkArray = (array: Float32Array): Float32Array[] => {
    const result: Float32Array[] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.subarray(i, i + chunkSize));
    }

    return result;
  };

  const leftChunks = chunkArray(left);
  const rightChunks = chunkArray(right);

  const blobs: Blob[] = [];

  for (let i = 0; i < leftChunks.length; i++) {
    blobs.push(getBlobFromChunkData(leftChunks[i], rightChunks[i]));
  }

  return blobs;
};

const resampleAudioBuffer = async (audioBuffer: AudioBuffer, desiredSampleRate: number): Promise<AudioBuffer> => {
  const offlineCtx = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.duration * desiredSampleRate,
    desiredSampleRate);

  // Play it from the beginning.
  const offlineSource = offlineCtx.createBufferSource();
  offlineSource.buffer = audioBuffer;
  offlineSource.connect(offlineCtx.destination);
  offlineSource.start();
  const resampled = await offlineCtx.startRendering();

  return resampled;
};

const createAudioBufferFromBlob = async (audioBlob: Blob): Promise<AudioBuffer | null> => {
  try {
    const arrayBuffer: ArrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer: AudioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const resampled: AudioBuffer = await resampleAudioBuffer(audioBuffer, 16000);

    return resampled;
  } catch (error) {
    console.error('Error decoding audio data:', error);

    return null;
  }
};

const concatenateAudioBuffers = (audioBuffers: AudioBuffer[]): AudioBuffer => {
  const totalLength = audioBuffers.reduce((length, buffer) => length + buffer.length, 0);

  const concatenatedBuffer = audioContext.createBuffer(
    2,
    totalLength,
    audioBuffers[0].sampleRate
  );

  let offset = 0;
  audioBuffers.forEach((buffer) => {
    concatenatedBuffer.copyToChannel(buffer.getChannelData(0), 0, offset);
    concatenatedBuffer.copyToChannel(buffer.getChannelData(1), 1, offset);
    offset += buffer.length;
  });

  return concatenatedBuffer;
};

// credits: https://stackoverflow.com/a/62173861
function getWavHeader(options: any) {
  const { numFrames } = options;
  const numChannels = options.numChannels || 2;
  const sampleRate = options.sampleRate || 16000;
  const bytesPerSample = options.isFloat ? 4 : 2;
  const format = options.isFloat ? 3 : 1;

  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numFrames * blockAlign;

  const buffer = new ArrayBuffer(44);
  const dv = new DataView(buffer);

  let p = 0;

  function writeString(s: any) {
    for (let i = 0; i < s.length; i++) {
      dv.setUint8(p + i, s.charCodeAt(i));
    }
    p += s.length;
  }

  function writeUint32(d: any) {
    dv.setUint32(p, d, true);
    p += 4;
  }

  function writeUint16(d: any) {
    dv.setUint16(p, d, true);
    p += 2;
  }

  writeString('RIFF'); // ChunkID
  writeUint32(dataSize + 36); // ChunkSize
  writeString('WAVE'); // Format
  writeString('fmt '); // Subchunk1ID
  writeUint32(16); // Subchunk1Size
  writeUint16(format); // AudioFormat https://i.stack.imgur.com/BuSmb.png
  writeUint16(numChannels); // NumChannels
  writeUint32(sampleRate); // SampleRate
  writeUint32(byteRate); // ByteRate
  writeUint16(blockAlign); // BlockAlign
  writeUint16(bytesPerSample * 8); // BitsPerSample
  writeString('data'); // Subchunk2ID
  writeUint32(dataSize); // Subchunk2Size

  return new Uint8Array(buffer);
}

function getWavBytes(buffer: any, options: any) {
  const type = options.isFloat ? Float32Array : Uint16Array;
  const numFrames = buffer.byteLength / type.BYTES_PER_ELEMENT;

  const headerBytes = getWavHeader({ ...options, numFrames });
  const wavBytes = new Uint8Array(headerBytes.length + buffer.byteLength);
  wavBytes.set(headerBytes, 0);
  wavBytes.set(new Uint8Array(buffer), headerBytes.length);

  return wavBytes;
}

export function audioBufferToBlob(audioBuffer: AudioBuffer): Blob {
  const [left, right] = [audioBuffer.getChannelData(0), audioBuffer.getChannelData(1)];

  const interleaved = new Float32Array(left.length + right.length);
  for (let src = 0, dst = 0; src < left.length; src++, dst += 2) {
    interleaved[dst] = left[src];
    interleaved[dst + 1] = right[src];
  }
  const wavBytes = getWavBytes(interleaved.buffer, {
    isFloat: true,
    numChannels: 2,
    sampleRate: 16000
  });

  return new Blob([wavBytes], { type: 'audio/wav' });
}

export const splitAudioBlob = async (blob: Blob): Promise<Blob[]> => {
  const arrayBuffer: ArrayBuffer = await blob.arrayBuffer();
  const audioBuffer: AudioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  // split into blobs
  const blobs = chunkAudioToBlobs({
    left: audioBuffer.getChannelData(0),
    right: audioBuffer.getChannelData(1),
  }, audioBuffer.sampleRate / 100); //1s = 1000ms = 100 chunks

  return blobs;
};

export const concatAudioBlob = async (blobs: Blob[]): Promise<Blob> => {
  const audioBuffers = await Promise.all(blobs.map(createAudioBufferFromBlob));
  const filteredAudioBuffers = audioBuffers.filter((buffer) => !!buffer) as AudioBuffer[];
  const concatedAudioBuffers = concatenateAudioBuffers(filteredAudioBuffers);

  return audioBufferToBlob(concatedAudioBuffers);
};

export const convertToBase64 = (blob: Blob, callback: (base64Str: string) => void) => {
  const reader = new FileReader();

  reader.onload = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const base64String = reader.result?.split(',')[1];
    callback(base64String);
  };

  reader.readAsDataURL(blob);
};

export const downloadBlob = (blob: Blob, fileName: string) => {
  const fileUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = fileName;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
