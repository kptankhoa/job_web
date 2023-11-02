import React from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

interface Props {
  disabled: boolean;
  label: string;
  value: Date | null;
  onChange: (value: Date | null) => void
}

const MyDatePicker = ({
  value, disabled, label, onChange
}: Props) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker
      disabled={disabled}
      label={label}
      value={value ? dayjs(value) : null}
      onChange={(newValue) => onChange(newValue ? newValue.toDate() : null)}
      className="full-width"
      format="DD/MM/YYYY"
    />
  </LocalizationProvider>

);

export default MyDatePicker;
