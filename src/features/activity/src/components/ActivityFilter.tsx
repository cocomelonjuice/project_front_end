import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

export type EntityTypeFilter = 'all' | 'issue' | 'project' | 'comment' | 'attachment' | 'sprint';

interface ActivityFilterProps {
  entityType: EntityTypeFilter;
  onEntityTypeChange: (entityType: EntityTypeFilter) => void;
}

const ActivityFilter: React.FC<ActivityFilterProps> = ({ entityType, onEntityTypeChange }) => {
  const { t, i18n } = useTranslation();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onEntityTypeChange(event.target.value as EntityTypeFilter);
  };

  const label = t('projectDetail.activityFilterLabel');

  return (
    <Box sx={{ mb: 2 }}>
      <FormControl key={i18n.language} size="small" sx={{ minWidth: 200 }}>
        <InputLabel>{label}</InputLabel>
        <Select value={entityType} label={label} onChange={handleChange}>
          <MenuItem value="all">{t('projectDetail.activityFilterAll')}</MenuItem>
          <MenuItem value="issue">{t('projectDetail.activityFilterIssue')}</MenuItem>
          <MenuItem value="project">{t('projectDetail.activityFilterProject')}</MenuItem>
          <MenuItem value="comment">{t('projectDetail.activityFilterComment')}</MenuItem>
          <MenuItem value="attachment">{t('projectDetail.activityFilterAttachment')}</MenuItem>
          <MenuItem value="sprint">{t('projectDetail.activityFilterSprint')}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default ActivityFilter;
