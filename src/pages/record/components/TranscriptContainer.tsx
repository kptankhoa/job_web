import React from 'react';
import { useRecordingContext } from '../context/RecordingState';
import { Grid, Typography } from '@mui/material';
import { Button } from 'components';
import { BlobData } from '../const';
import { downloadBlob } from '../util/recording.util';

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
      {Object.values(blobDataMap).map((item: BlobData) => (
        <Grid
          item
          xs={12}
          key={item.id}
        >
          <Grid container justifyContent="space-between">
            <Grid item>
              {`${item.id}: ${item.transcript}`}
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => onDownload(item)}
              >
                Download
              </Button>
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default TranscriptContainer;
