import React from 'react';
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

const ActivityFilter: React.FC<ActivityFilterProps> = ({
  entityType,
  onEntityTypeChange,
}) => {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onEntityTypeChange(event.target.value as EntityTypeFilter);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Filter by Type</InputLabel>
        <Select
          value={entityType}
          label="Filter by Type"
          onChange={handleChange}
        >
          <MenuItem value="all">All Activity</MenuItem>
          <MenuItem value="issue">Issues</MenuItem>
          <MenuItem value="project">Projects</MenuItem>
          <MenuItem value="comment">Comments</MenuItem>
          <MenuItem value="attachment">Attachments</MenuItem>
          <MenuItem value="sprint">Sprints</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default ActivityFilter;
