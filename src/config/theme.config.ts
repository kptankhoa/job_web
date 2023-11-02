import { createTheme, Theme } from '@mui/material/styles';
import { cyan, grey, lightGreen, teal } from '@mui/material/colors';

declare module '@mui/material/styles' {
  interface Theme {
    background: {
      default: string;
      header: string;
      fullPage: string;
    };
    text: {
      default: string;
    }
  }

  interface ThemeOptions {
    background?: {
      default?: string;
      header?: string;
      fullPage?: string;
    };
    text?: {
      default?: string;
    }
  }
}

export const theme: Theme = createTheme({
  background: {
    default: cyan[50],
    header: cyan[300],
    fullPage: cyan[200]
  },
  text: {
    default: grey[100],
  },
  palette: {
    primary: {
      main: teal[500]
    }
  }
});
