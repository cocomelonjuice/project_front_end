import { ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';

export type LanguageSwitcherVariant = 'header' | 'light';

export interface LanguageSwitcherProps {
  /** header = white on gradient app bar; light = dark text on pale background (login/register) */
  variant?: LanguageSwitcherVariant;
}

/**
 * Compact EN / VI switcher for header toolbar or auth pages.
 */
export const LanguageSwitcher = ({ variant = 'header' }: LanguageSwitcherProps) => {
  const { i18n, t } = useTranslation();

  const handleChange = (_: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (value === 'en' || value === 'vi') {
      void i18n.changeLanguage(value);
    }
  };

  const isLight = variant === 'light';

  return (
    <Tooltip title={t('language.label')} arrow placement="bottom">
      <ToggleButtonGroup
        value={i18n.language.startsWith('vi') ? 'vi' : 'en'}
        exclusive
        onChange={handleChange}
        size="small"
        aria-label={t('language.label')}
        sx={{
          '& .MuiToggleButton-root': isLight
            ? {
                color: 'text.primary',
                borderColor: 'divider',
                px: 1,
                py: 0.25,
                minWidth: 40,
                fontSize: '0.75rem',
                fontWeight: 600,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  borderColor: 'primary.main',
                },
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }
            : {
                color: 'rgba(255, 255, 255, 0.85)',
                borderColor: 'rgba(255, 255, 255, 0.35)',
                px: 1,
                py: 0.25,
                minWidth: 40,
                fontSize: '0.75rem',
                fontWeight: 600,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.25) !important',
                  color: '#fff',
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                },
              },
        }}
      >
        <ToggleButton value="en" aria-label="English">
          EN
        </ToggleButton>
        <ToggleButton value="vi" aria-label="Tiếng Việt">
          VI
        </ToggleButton>
      </ToggleButtonGroup>
    </Tooltip>
  );
};

export default LanguageSwitcher;
