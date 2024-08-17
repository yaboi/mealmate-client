import * as React from 'react';
import { ThemeProvider as ThemeProviderMUI } from '@mui/material';

import theme from './theme';

interface ThemeProviderProps {
  /**
   * Your component tree.
   */
  children?: React.ReactNode;
}

function ThemeProvider(props: ThemeProviderProps) {
  const { children } = props;
  return <ThemeProviderMUI theme={theme}>{children}</ThemeProviderMUI>;
}

export default ThemeProvider;
