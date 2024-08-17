import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { createTheme } from '@mui/material/styles';

/**
 * TODO:
 * Continue to customize and build this theme based on the chose color palette
 * ref: https://coolors.co/palette/264653-2a9d8f-e9c46a-f4a261-e76f51
 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#2A9D8F',
    },
    secondary: {
      main: '#264653',
    },
  },
});

export default theme;
