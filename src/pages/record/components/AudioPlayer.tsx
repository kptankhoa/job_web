import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import { PlayArrow, Stop } from '@mui/icons-material';
const AudioPlayer = ({ blob }: { blob: Blob }) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const onPlay = () => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
    setAudio(audio);
  };
  const onStop = () => {
    if (audio) {
      audio.pause();
      audio.remove();
      setAudio(null);
    }
  };

  return (
    <IconButton
      color="primary"
      onClick={audio ? onStop : onPlay}
    >
      {audio ? <Stop /> : <PlayArrow />}
    </IconButton>
  );
};

export default AudioPlayer;
