import { createTheme, Theme } from '@mui/material/styles';
import { cyan, grey, lightGreen, teal } from '@mui/material/colors';

declare module '@mui/material/styles' {
  interface Theme {
    background: {
      default: string;
      header: string;
    };
    text: {
      default: string;
      dark: string;
    }
  }

  interface ThemeOptions {
    background?: {
      default?: string;
      header?: string;
    };
    text?: {
      default?: string;
      dark?: string;
    }
  }
}

export const theme: Theme = createTheme({
  background: {
    default: lightGreen[50],
    header: cyan[300]
  },
  text: {
    default: grey[100],
    dark: grey[600]
  },
  palette: {
    primary: {
      main: teal[500]
    }
  }
});
