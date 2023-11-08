import { useEffect, useState } from 'react';

const useHandleMediaStream = () => {
  const [activatedStreamMap, setActiveStreamMap] = useState<{[id: string]: MediaStream}>({});

  const mapNewStream = (id: string, stream: MediaStream) => {
    setActiveStreamMap((oldStreams) => ({ ...oldStreams, [id]: stream }));
  };

  const stopStreamTracks = (stream: MediaStream) => {
    stream.getTracks().forEach((track) => {
      track?.stop();
    });
  };

  const stopAllMediaStream = () => {
    Object.values(activatedStreamMap).forEach(stopStreamTracks);
    setActiveStreamMap({});
  };

  useEffect(() => () => {
    Object.values(activatedStreamMap).forEach(stopStreamTracks);
  }, [activatedStreamMap]);

  return {
    mapNewStream,
    stopAllMediaStream
  };
};

export default useHandleMediaStream;
