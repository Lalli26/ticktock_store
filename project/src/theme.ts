import { createTheme } from '@mui/material/styles';

const HEADING_FONT = '"Playfair Display", Georgia, serif';
const BODY_FONT = '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif';

const theme = createTheme({
  palette: {
    primary: { main: '#111111', light: '#2B2B2B', dark: '#000000', contrastText: '#FFFFFF' },
    secondary: { main: '#C9A24A', light: '#E3C77F', dark: '#9C7A2C', contrastText: '#111111' },
    success: { main: '#2E7D5B', light: '#4CAF82', dark: '#1F5C41', contrastText: '#FFFFFF' },
    warning: { main: '#B26A00', light: '#E09A2B', dark: '#7A4A00', contrastText: '#FFFFFF' },
    error: { main: '#C62828', light: '#E55353', dark: '#8E1B1B', contrastText: '#FFFFFF' },
    background: { default: '#FAF8F4', paper: '#FFFFFF' },
    text: { primary: '#111111', secondary: '#5C5C5C' },
    divider: '#E7E2D8',
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: BODY_FONT,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: { fontFamily: HEADING_FONT, fontWeight: 600, lineHeight: 1.2 },
    h2: { fontFamily: HEADING_FONT, fontWeight: 600, lineHeight: 1.2 },
    h3: { fontFamily: HEADING_FONT, fontWeight: 600, lineHeight: 1.2 },
    h4: { fontFamily: HEADING_FONT, fontWeight: 600, lineHeight: 1.2 },
    h5: { fontFamily: HEADING_FONT, fontWeight: 600, lineHeight: 1.2 },
    h6: { fontFamily: HEADING_FONT, fontWeight: 600, lineHeight: 1.2 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0.2 },
    body1: { lineHeight: 1.5 },
    body2: { lineHeight: 1.5 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 24,
          paddingBlock: 10,
          transition: 'transform 200ms ease, box-shadow 200ms ease, background-color 200ms ease',
          '&:hover': { transform: 'translateY(-1px)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #E7E2D8',
          boxShadow: '0 1px 2px rgba(17, 17, 17, 0.04)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },
  },
});

export default theme;
