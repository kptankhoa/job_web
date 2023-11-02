import React from 'react';
import { Job } from 'constant';
import { Grid } from '@mui/material';
import { Button, DatePicker, TextField } from 'components';

interface JobDataFormProps {
  mode: 'create' | 'update'
  disabled: boolean;
  data: Partial<Job>;
  onChange: (key: keyof Job, value: any) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

const JobDataForm = ({
  mode, disabled, data, onChange, onCancel, onSubmit
}: JobDataFormProps) => {
  const label = mode === 'create' ? 'Create' : 'Update';

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          label="Title"
          value={data?.title || ''}
          disabled={disabled}
          onChange={(e) => onChange('title', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Description"
          multiline
          rows={4}
          disabled={disabled}
          value={data?.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <DatePicker
          disabled={disabled}
          label="Expiry Date"
          value={data?.expiryDate || null}
          onChange={(value) => console.log(value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Grid container justifyContent="flex-end" spacing={3}>
          <Grid item>
            <Button color="error" variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              disabled={disabled}
              onClick={onSubmit}
            >
              {label}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default JobDataForm;
