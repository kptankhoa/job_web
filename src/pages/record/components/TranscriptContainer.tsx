import React from 'react';
import { useRecordingContext } from '../context/RecordingState';
import { Grid, Stack, Typography } from '@mui/material';
import { Button } from 'components';
import { BlobData } from '../const';
import { downloadBlob } from '../util/recording.util';
import AudioPlayer from './AudioPlayer';

const TranscriptContainer = () => {
  const {
    blobDataMap
  } = useRecordingContext();

  const onDownload = ({ id, blob }: BlobData) => {
    const name = `${id}.wav`;
    downloadBlob(blob, name);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography component="h3" sx={{ fontWeight: 'bold' }}>
          Transcript parts:
        </Typography>
      </Grid>
      {Object.values(blobDataMap).reverse().map((item: BlobData) => (
        <Grid
          item
          xs={12}
          key={item.id}
        >
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography>
                {`${item.id}: ${item.transcript === null ? 'null' : (item.transcript || '[Empty]')}`}
              </Typography>
            </Grid>
            <Grid item>
              <Stack direction="row" spacing={2}>
                <AudioPlayer blob={item.blob} />
                <Button
                  variant="contained"
                  onClick={() => onDownload(item)}
                >
                  Download Audio
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default TranscriptContainer;
