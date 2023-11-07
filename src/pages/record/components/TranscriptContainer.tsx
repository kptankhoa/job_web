import React from 'react';
import { useRecordingContext } from '../context/RecordingState';
import { Grid, Typography } from '@mui/material';
import { BlobData } from '../const';
import { Button } from '../../../components';

const downloadBlob = (blob: Blob, fileName: string) => {
  const fileUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = fileName;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

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
