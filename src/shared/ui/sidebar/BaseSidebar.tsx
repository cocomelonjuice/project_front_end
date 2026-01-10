import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Typography, Chip, IconButton, Tooltip } from '@mui/material';
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

    const itemElement = (
      <React.Fragment key={item.id}>
        <ListItem
          disablePadding
          sx={{
            pl: level * 2,
            '& .MuiListItemButton-root': {
              minHeight: 40,
              borderRadius: '8px',
              mx: 1,
              mb: 0.5,
              backgroundColor: isActive 
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(79, 70, 229, 0.15) 100%)' 
                : 'transparent',
              background: isActive 
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(79, 70, 229, 0.15) 100%)' 
                : 'transparent',
              borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
              boxShadow: isActive ? '0 2px 4px rgba(99, 102, 241, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : 'none',
              '&:hover': {
                background: isActive 
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(79, 70, 229, 0.2) 100%)' 
                  : 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(79, 70, 229, 0.08) 100%)',
                boxShadow: isActive 
                  ? '0 4px 8px rgba(99, 102, 241, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.4)' 
                  : '0 2px 4px rgba(99, 102, 241, 0.15)',
                transform: 'translateX(2px)',
              },
              transition: 'all 0.2s ease',
              justifyContent: 'flex-start',
              alignItems: 'center',
            },
          }}
        >
          <ListItemButton
            onClick={() => handleItemClick(item)}
            sx={{
              py: 1,
              px: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            {item.icon && (
              <ListItemIcon
                sx={{
                  minWidth: collapsed ? 0 : 36,
                  color: isActive ? '#6366f1' : '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '& .MuiSvgIcon-root': {
                    fontSize: '20px',
                  },
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
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#6366f1' : '#374151',
                  }}
                  sx={{
                    '& .MuiListItemText-primary': {
                      lineHeight: 1.5,
                    },
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
                  <IconButton 
                    size="small" 
                    sx={{ 
                      ml: 1,
                      color: '#9ca3af',
                      '&:hover': {
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        color: '#6366f1',
                      },
                    }}
                  >
                    {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                  </IconButton>
                )}
                {item.external && (
                  <OpenInNew fontSize="small" sx={{ ml: 1, fontSize: '16px', color: '#9ca3af' }} />
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

    // Wrap with tooltip if collapsed
    if (collapsed && item.icon) {
      return (
        <Tooltip key={item.id} title={item.label} arrow placement="right">
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 0.5 }}>
            {itemElement}
          </Box>
        </Tooltip>
      );
    }

    return itemElement;
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
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {section.title}
            </Typography>
            {section.collapsible && (
              <Tooltip title={isExpanded ? "Collapse section" : "Expand section"} arrow placement="right">
                <IconButton 
                  size="small" 
                  onClick={() => handleSectionToggle(section.id)}
                  sx={{
                    color: '#9ca3af',
                    '&:hover': {
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      color: '#6366f1',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                </IconButton>
              </Tooltip>
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
              py: 1.5,
              fontSize: '11px',
              fontWeight: 600,
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
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
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        borderRight: '1px solid rgba(226, 232, 240, 0.5)',
        transition: 'width 0.3s ease',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0, // Important for flex children to respect overflow
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Box
        ref={scrollContainerRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          py: 2,
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

