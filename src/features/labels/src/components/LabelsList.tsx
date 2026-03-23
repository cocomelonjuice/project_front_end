import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import LabelChip from './LabelChip';
import type { Label } from '../store/states';

interface LabelsListProps {
  labels: Label[];
  onDelete?: (label: Label) => void;
  onClick?: (label: Label) => void;
  emptyMessage?: string;
}

const LabelsList: React.FC<LabelsListProps> = ({
  labels,
  onDelete,
  onClick,
  emptyMessage: emptyMessageProp,
}) => {
  const { t } = useTranslation();
  const emptyMessage = emptyMessageProp ?? t('labelsList.empty');
  if (labels.length === 0) {
    return (
      <Box sx={{ py: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {labels.map((label) => (
        <LabelChip
          key={label.id}
          label={label}
          onDelete={onDelete}
          onClick={onClick}
          clickable={!!onClick}
        />
      ))}
    </Box>
  );
};

export default LabelsList;
