import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

const MyTextField = (props: TextFieldProps) => (
  <TextField
    {...props}
    fullWidth
    variant="outlined"
  />
);

export default MyTextField;
