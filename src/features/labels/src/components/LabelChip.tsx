import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import type { Label } from '../store/states';

interface LabelChipProps {
  label: Label;
  onDelete?: (label: Label) => void;
  size?: 'small' | 'medium';
  clickable?: boolean;
  onClick?: (label: Label) => void;
}

const LabelChip: React.FC<LabelChipProps> = ({
  label,
  onDelete,
  size = 'small',
  clickable = false,
  onClick,
}) => {
  const backgroundColor = label.color || '#64748B';
  const textColor = getContrastColor(backgroundColor);

  const handleClick = () => {
    if (clickable && onClick) {
      onClick(label);
    }
  };

  const chip = (
    <Chip
      label={label.name}
      size={size}
      onDelete={onDelete ? () => onDelete(label) : undefined}
      onClick={handleClick}
      clickable={clickable}
      sx={{
        bgcolor: backgroundColor,
        color: textColor,
        fontWeight: 500,
        '&:hover': {
          opacity: 0.8,
        },
        '& .MuiChip-deleteIcon': {
          color: textColor,
        },
      }}
    />
  );

  if (label.description) {
    return (
      <Tooltip title={label.description} arrow>
        {chip}
      </Tooltip>
    );
  }

  return chip;
};

// Helper to determine if text should be black or white based on background color
const getContrastColor = (hexColor: string): string => {
  // Remove # if present
  const color = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

export default LabelChip;
