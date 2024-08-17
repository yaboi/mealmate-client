import * as React from 'react';
import { ThemeProvider as ThemeProviderMUI } from '@mui/material';
import PropTypes from 'prop-types';

import theme from './theme';

function ThemeProvider(props: any) {
  const { children } = props;
  return <ThemeProviderMUI theme={theme}>{children}</ThemeProviderMUI>;
}

ThemeProvider.propTypes = {
  /**
   * Your component tree.
   */
  children: PropTypes.node,
};

export default ThemeProvider;
