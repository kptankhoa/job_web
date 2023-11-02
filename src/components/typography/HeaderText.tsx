import React from 'react';
import { Typography, useTheme } from '@mui/material';

interface Props {
  content: string;
  subContent?: string;
}

const HeaderText = ({
  content, subContent
}: Props) => {
  const theme = useTheme();

  return (
    <>
      <Typography
        style={{
          color: theme.text.default,
          fontSize: 40,
          fontWeight: 500
        }}
      >
        {content}
      </Typography>
      {subContent && (
        <Typography
          style={{
            color: theme.text.default,
            fontSize: 32,
            fontWeight: 300
          }}
        >
          {subContent}
        </Typography>
      )}
    </>
  );
};

export default HeaderText;
