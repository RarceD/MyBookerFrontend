import { createTheme } from '@mui/material/styles';

// ─── Brand palette ────────────────────────────────────────────────────────────
const accent      = '#FF8400';
const accentDark  = '#c96800';
const accentLight = '#ffb347';

const base          = '#0f1117';
const surface       = '#16181f';
const card          = '#1e2028';
const cardElevated  = '#272a35';
const border        = '#2c2f3e';

const textPrimary   = '#f0f0f5';
const textSecondary = '#a0a3b1';
const textMuted     = '#5c6070';

// ─── Theme ────────────────────────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main:        accent,
      dark:        accentDark,
      light:       accentLight,
      contrastText: '#fff',
    },
    secondary: {
      main:        accentLight,
      contrastText: '#fff',
    },
    background: {
      default: base,
      paper:   card,
    },
    text: {
      primary:   textPrimary,
      secondary: textSecondary,
      disabled:  textMuted,
    },
    divider: border,
    error:   { main: '#ef4444' },
    warning: { main: '#f59e0b' },
    success: { main: '#22c55e' },
  },

  // ─── Typography ─────────────────────────────────────────────────────────────
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, Helvetica, Arial, sans-serif",
    fontWeightLight:   300,
    fontWeightRegular: 400,
    fontWeightMedium:  500,
    fontWeightBold:    700,
    h1: { fontSize: '2rem',    fontWeight: 700, letterSpacing: '-0.025em', color: textPrimary },
    h2: { fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em',  color: textPrimary },
    h3: { fontSize: '1.5rem',  fontWeight: 600, letterSpacing: '-0.015em', color: textPrimary },
    h4: { fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.01em',  color: textPrimary },
    h5: { fontSize: '1.1rem',  fontWeight: 600, color: textPrimary },
    h6: { fontSize: '1rem',    fontWeight: 600, color: textPrimary },
    subtitle1: { fontSize: '0.95rem', fontWeight: 500, color: textPrimary },
    subtitle2: { fontSize: '0.85rem', fontWeight: 500, color: textSecondary },
    body1: { fontSize: '0.95rem', color: textPrimary },
    body2: { fontSize: '0.85rem', color: textSecondary },
    caption: { fontSize: '0.75rem', color: textMuted },
    button: { fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.025em', textTransform: 'none' },
  },

  // ─── Shape ──────────────────────────────────────────────────────────────────
  shape: {
    borderRadius: 12,
  },

  // ─── Component overrides ────────────────────────────────────────────────────
  components: {

    // AppBar
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: surface,
          backgroundImage: 'none',
          borderBottom: `1px solid ${border}`,
          boxShadow: '0 1px 20px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(12px)',
        },
      },
    },

    // Toolbar
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '64px !important',
        },
      },
    },

    // Buttons
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontWeight: 600,
          fontSize: '0.875rem',
          letterSpacing: '0.025em',
          textTransform: 'none',
          transition: 'all 0.2s ease',
        },
        contained: {
          background: `linear-gradient(135deg, ${accent} 0%, ${accentDark} 100%)`,
          color: '#fff',
          boxShadow: `0 4px 16px rgba(255, 132, 0, 0.3)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${accentLight} 0%, ${accent} 100%)`,
            boxShadow: `0 6px 20px rgba(255, 132, 0, 0.45)`,
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        outlined: {
          borderColor: accent,
          color: accent,
          '&:hover': {
            borderColor: accentLight,
            color: accentLight,
            backgroundColor: 'rgba(255, 132, 0, 0.08)',
          },
        },
        text: {
          color: accent,
          '&:hover': {
            backgroundColor: 'rgba(255, 132, 0, 0.08)',
          },
        },
      },
    },

    // TextField
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: cardElevated,
            borderRadius: 10,
            color: textPrimary,
            '& fieldset': {
              borderColor: border,
              transition: 'border-color 0.2s',
            },
            '&:hover fieldset': {
              borderColor: textMuted,
            },
            '&.Mui-focused fieldset': {
              borderColor: accent,
              borderWidth: '1.5px',
            },
          },
          '& .MuiInputLabel-root': {
            color: textSecondary,
            '&.Mui-focused': {
              color: accent,
            },
          },
          '& .MuiInputBase-input': {
            color: textPrimary,
          },
        },
      },
    },

    // Select / Input
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: cardElevated,
          '& fieldset': {
            borderColor: border,
          },
          '&:hover fieldset': {
            borderColor: textMuted,
          },
          '&.Mui-focused fieldset': {
            borderColor: accent,
          },
        },
      },
    },

    // Checkbox
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: textMuted,
          '&.Mui-checked': {
            color: accent,
          },
        },
      },
    },

    // Radio
    MuiRadio: {
      styleOverrides: {
        root: {
          color: textMuted,
          '&.Mui-checked': {
            color: accent,
          },
        },
      },
    },

    // Slider
    MuiSlider: {
      styleOverrides: {
        root: {
          color: accent,
          '& .MuiSlider-thumb': {
            boxShadow: `0 0 0 6px rgba(255, 132, 0, 0.15)`,
            '&:hover': {
              boxShadow: `0 0 0 10px rgba(255, 132, 0, 0.2)`,
            },
          },
          '& .MuiSlider-track': {
            background: `linear-gradient(90deg, ${accentDark}, ${accent})`,
          },
          '& .MuiSlider-rail': {
            backgroundColor: border,
          },
        },
      },
    },

    // Tabs
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTabs-indicator': {
            backgroundColor: accent,
            height: 3,
            borderRadius: '3px 3px 0 0',
          },
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          color: textSecondary,
          fontWeight: 500,
          textTransform: 'none',
          fontSize: '0.875rem',
          '&.Mui-selected': {
            color: accent,
            fontWeight: 600,
          },
        },
      },
    },

    // Bottom Navigation
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: surface,
          borderTop: `1px solid ${border}`,
          height: 64,
        },
      },
    },

    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: textMuted,
          minWidth: 56,
          '&.Mui-selected': {
            color: accent,
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.7rem',
            fontWeight: 500,
            '&.Mui-selected': {
              fontSize: '0.7rem',
              fontWeight: 600,
            },
          },
        },
      },
    },

    // Card / Paper
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: card,
          border: `1px solid ${border}`,
        },
        elevation1: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.45)',
        },
        elevation2: {
          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
        },
        elevation3: {
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        },
      },
    },

    // Dialog
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: cardElevated,
          border: `1px solid ${border}`,
          borderRadius: 16,
          boxShadow: '0 24px 64px rgba(0,0,0,0.75)',
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: textPrimary,
          fontWeight: 600,
          fontSize: '1.1rem',
          padding: '20px 24px 12px',
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          color: textSecondary,
          padding: '0 24px 12px',
        },
      },
    },

    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '12px 24px 20px',
          gap: 8,
        },
      },
    },

    // Accordion
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: card,
          border: `1px solid ${border}`,
          borderRadius: '12px !important',
          marginBottom: 8,
          boxShadow: 'none',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            border: `1px solid rgba(255, 132, 0, 0.3)`,
          },
        },
      },
    },

    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          color: textPrimary,
          fontWeight: 500,
          '&.Mui-expanded': {
            color: accent,
          },
          '& .MuiAccordionSummary-expandIconWrapper': {
            color: textSecondary,
            '&.Mui-expanded': {
              color: accent,
            },
          },
        },
      },
    },

    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          color: textSecondary,
          borderTop: `1px solid ${border}`,
          padding: '12px 16px 16px',
        },
      },
    },

    // List
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          '&:hover': {
            backgroundColor: 'rgba(255, 132, 0, 0.06)',
          },
        },
      },
    },

    // Chip
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '0.75rem',
        },
        filled: {
          backgroundColor: cardElevated,
          color: textPrimary,
          border: `1px solid ${border}`,
        },
        outlined: {
          borderColor: accent,
          color: accent,
        },
      },
    },

    // Avatar
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: cardElevated,
        },
      },
    },

    // Snackbar
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            backgroundColor: cardElevated,
            border: `1px solid ${border}`,
            borderRadius: 10,
            color: textPrimary,
          },
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 500,
        },
      },
    },

    // Divider
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: border,
        },
      },
    },

    // FormControlLabel
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: textSecondary,
          fontSize: '0.875rem',
        },
      },
    },

    // Link
    MuiLink: {
      styleOverrides: {
        root: {
          color: accent,
          textDecorationColor: 'transparent',
          '&:hover': {
            color: accentLight,
            textDecorationColor: accentLight,
          },
        },
      },
    },
  },
});

export default theme;
