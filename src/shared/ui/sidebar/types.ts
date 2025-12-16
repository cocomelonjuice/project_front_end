import type { ReactNode } from 'react';

/**
 * Sidebar Item Types
 */

export interface SidebarNavItem {
  id: string;
  label: string;
  icon?: ReactNode;
  path?: string;
  onClick?: () => void;
  badge?: number | string;
  active?: boolean;
  expandable?: boolean;
  expanded?: boolean;
  children?: SidebarNavItem[];
  external?: boolean;
  actionButton?: {
    label: string;
    onClick: () => void;
    variant?: 'contained' | 'outlined' | 'text';
    color?: 'primary' | 'secondary' | 'default';
  };
}

export interface SidebarSection {
  id: string;
  title?: string;
  items: SidebarNavItem[];
  collapsible?: boolean;
  collapsed?: boolean;
}

export interface SidebarGroup {
  id: string;
  title?: string;
  sections: SidebarSection[];
}

export interface BaseSidebarProps {
  /**
   * Whether the sidebar is collapsed
   */
  collapsed?: boolean;
  /**
   * Width of the sidebar when expanded (in pixels)
   */
  width?: number;
  /**
   * Width of the sidebar when collapsed (in pixels)
   */
  collapsedWidth?: number;
  /**
   * Background color
   */
  backgroundColor?: string;
  /**
   * Active item ID
   */
  activeItemId?: string;
  /**
   * Callback when an item is clicked
   */
  onItemClick?: (item: SidebarNavItem) => void;
  /**
   * Custom className
   */
  className?: string;
}

