import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Typography, Chip, IconButton } from '@mui/material';
import { ExpandMore, ExpandLess, OpenInNew } from '@mui/icons-material';
import type { BaseSidebarProps, SidebarNavItem, SidebarSection, SidebarGroup } from './types';

export interface BaseSidebarComponentProps extends BaseSidebarProps {
  /**
   * Sidebar groups to display
   */
  groups?: SidebarGroup[];
  /**
   * Simple navigation items (if not using groups)
   */
  items?: SidebarNavItem[];
  /**
   * Sections to display (if not using groups)
   */
  sections?: SidebarSection[];
}

/**
 * BaseSidebar Component
 * 
 * A flexible, reusable sidebar component that can be configured with different layouts.
 * Supports groups, sections, and simple item lists.
 * 
 * @example
 * ```tsx
 * <BaseSidebar
 *   collapsed={false}
 *   groups={sidebarGroups}
 *   onItemClick={(item) => navigate(item.path)}
 * />
 * ```
 */
export const BaseSidebar: React.FC<BaseSidebarComponentProps> = ({
  collapsed = false,
  width = 280,
  collapsedWidth = 64,
  backgroundColor = '#ffffff',
  activeItemId,
  onItemClick,
  groups,
  items,
  sections,
  className,
}) => {
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set());
  const [isScrolling, setIsScrolling] = React.useState(false);
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleItemClick = (item: SidebarNavItem) => {
    if (item.expandable && !collapsed) {
      const newExpanded = new Set(expandedItems);
      if (newExpanded.has(item.id)) {
        newExpanded.delete(item.id);
      } else {
        newExpanded.add(item.id);
      }
      setExpandedItems(newExpanded);
    }

    if (item.onClick) {
      item.onClick();
    }

    if (onItemClick) {
      onItemClick(item);
    }
  };

  const handleSectionToggle = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Handle scroll to show scrollbar when scrolling
  React.useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      setIsScrolling(true);
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Hide scrollbar after scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const renderItem = (item: SidebarNavItem, level: number = 0): React.ReactNode => {
    const isActive = activeItemId === item.id || item.active;
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <React.Fragment key={item.id}>
        <ListItem
          disablePadding
          sx={{
            pl: level * 2,
            '& .MuiListItemButton-root': {
              minHeight: 40,
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
              backgroundColor: isActive ? 'rgba(0, 82, 204, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: isActive ? 'rgba(0, 82, 204, 0.15)' : 'rgba(0, 0, 0, 0.04)',
              },
            },
          }}
        >
          <ListItemButton
            onClick={() => handleItemClick(item)}
            sx={{
              py: 0.75,
            }}
          >
            {item.icon && (
              <ListItemIcon
                sx={{
                  minWidth: collapsed ? 0 : 40,
                  color: isActive ? '#0052CC' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
            )}
            {!collapsed && (
              <>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#0052CC' : 'inherit',
                  }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '11px',
                      minWidth: 20,
                    }}
                  />
                )}
                {item.expandable && (
                  <IconButton size="small" sx={{ ml: 1 }}>
                    {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                  </IconButton>
                )}
                {item.external && (
                  <OpenInNew fontSize="small" sx={{ ml: 1, fontSize: '16px', color: '#999' }} />
                )}
                {item.actionButton && (
                  <Chip
                    label={item.actionButton.label}
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      item.actionButton?.onClick();
                    }}
                    size="small"
                    variant={item.actionButton.variant === 'contained' ? 'filled' : 'outlined'}
                    color={item.actionButton.color || 'primary'}
                    sx={{
                      height: 24,
                      fontSize: '11px',
                      ml: 1,
                    }}
                  />
                )}
              </>
            )}
          </ListItemButton>
        </ListItem>
        {!collapsed && hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map((child) => renderItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const renderSection = (section: SidebarSection): React.ReactNode => {
    const isExpanded = !section.collapsible || expandedSections.has(section.id);

    return (
      <Box key={section.id} sx={{ mb: 2 }}>
        {section.title && !collapsed && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {section.title}
            </Typography>
            {section.collapsible && (
              <IconButton size="small" onClick={() => handleSectionToggle(section.id)}>
                {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
              </IconButton>
            )}
          </Box>
        )}
        <Collapse in={isExpanded}>
          <List disablePadding>
            {section.items.map((item) => renderItem(item))}
          </List>
        </Collapse>
      </Box>
    );
  };

  const renderGroup = (group: SidebarGroup): React.ReactNode => {
    return (
      <Box key={group.id} sx={{ mb: 3 }}>
        {group.title && !collapsed && (
          <Typography
            variant="subtitle2"
            sx={{
              px: 2,
              py: 1,
              fontSize: '13px',
              fontWeight: 600,
              color: '#333',
            }}
          >
            {group.title}
          </Typography>
        )}
        {group.sections.map((section) => renderSection(section))}
      </Box>
    );
  };

  return (
    <Box
      className={className}
      sx={{
        width: collapsed ? collapsedWidth : width,
        flexShrink: 0,
        backgroundColor,
        borderRight: '1px solid #e0e0e0',
        transition: 'width 0.3s ease',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0, // Important for flex children to respect overflow
      }}
    >
      <Box
        ref={scrollContainerRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          py: 1,
          minHeight: 0, // Important for flex children to respect overflow
          // Hide scrollbar by default, show on hover or when scrolling
          scrollbarWidth: 'thin',
          scrollbarColor: isScrolling 
            ? 'rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.1)' 
            : 'transparent transparent',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: isScrolling ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: isScrolling ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
            borderRadius: '4px',
          },
          '&:hover': {
            scrollbarColor: 'rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.1)',
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
            },
          },
        }}
      >
        {groups && groups.map((group) => renderGroup(group))}
        {sections && sections.map((section) => renderSection(section))}
        {items && (
          <List disablePadding>
            {items.map((item) => renderItem(item))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default BaseSidebar;

