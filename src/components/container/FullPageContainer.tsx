import React, { ReactNode } from 'react';
import { useTheme } from '@mui/material';
import HeaderText from '../typography/HeaderText';

interface Props {
  content: string;
  subContent?: string;
  children?: ReactNode;
}

const FullPageContainer = ({ content, subContent, children }: Props) => {
  const theme = useTheme();

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: theme.background.fullPage
      }}
    >
      <HeaderText
        content={content}
        subContent={subContent}
      />
      {children}
    </div>
  );
};

export default FullPageContainer;
