import React from 'react';
import { useTheme } from '@mui/material';
import HeaderText from '../typography/HeaderText';

interface Props {
  title: string
}

const Header = ({ title }: Props) => {
  const theme = useTheme();

  return (
    <div
      style={{
        width: '100%',
        height: '150px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: theme.background.header
      }}
    >
      <HeaderText
        content={title}
      />
    </div>
  );
};

export default Header;
