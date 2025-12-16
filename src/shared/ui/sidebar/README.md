# Sidebar Components

This folder contains reusable sidebar components that can be used throughout the application.

## Structure

```
sidebar/
├── types.ts                 # TypeScript interfaces and types
├── BaseSidebar.tsx          # Base reusable sidebar component
├── NavigationSidebar.tsx    # First sidebar implementation (Confluence-style)
├── index.ts                 # Exports
└── README.md               # This file
```

## Components

### BaseSidebar

The base sidebar component that provides the core functionality. It supports:
- Groups, sections, and simple item lists
- Expandable/collapsible items
- Active state highlighting
- External links
- Action buttons
- Badges
- Customizable styling

### NavigationSidebar

A complete sidebar implementation based on Confluence-style navigation. Features:
- Primary navigation (For you, Recent, Starred, Apps, Plans, Spaces)
- Recent items section
- Recommended section
- Categorized links
- External application links

## Usage

### Using NavigationSidebar

```tsx
import { NavigationSidebar } from '@/shared/ui/sidebar';

<NavigationSidebar
  collapsed={false}
  onItemClick={(item) => console.log(item)}
/>
```

### Creating a New Sidebar

To create a new sidebar variant, create a new file (e.g., `AdminSidebar.tsx`):

```tsx
import React from 'react';
import { BaseSidebar } from './BaseSidebar';
import type { SidebarGroup, SidebarNavItem } from './types';
import { Dashboard, Settings, Users } from '@mui/icons-material';

export const AdminSidebar: React.FC<{ collapsed?: boolean }> = ({ collapsed }) => {
  const adminGroups: SidebarGroup[] = [
    {
      id: 'admin',
      sections: [
        {
          id: 'admin-nav',
          items: [
            {
              id: 'dashboard',
              label: 'Dashboard',
              icon: <Dashboard />,
              path: '/admin/dashboard',
            },
            {
              id: 'users',
              label: 'Users',
              icon: <Users />,
              path: '/admin/users',
            },
            {
              id: 'settings',
              label: 'Settings',
              icon: <Settings />,
              path: '/admin/settings',
            },
          ],
        },
      ],
    },
  ];

  return (
    <BaseSidebar
      collapsed={collapsed}
      groups={adminGroups}
      onItemClick={(item) => {
        if (item.path) {
          navigate(item.path);
        }
      }}
    />
  );
};
```

Then export it from `index.ts`:

```tsx
export { AdminSidebar } from './AdminSidebar';
```

## Types

### SidebarNavItem

```typescript
interface SidebarNavItem {
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
```

### SidebarSection

```typescript
interface SidebarSection {
  id: string;
  title?: string;
  items: SidebarNavItem[];
  collapsible?: boolean;
  collapsed?: boolean;
}
```

### SidebarGroup

```typescript
interface SidebarGroup {
  id: string;
  title?: string;
  sections: SidebarSection[];
}
```

## Examples

### Simple Sidebar with Items

```tsx
<BaseSidebar
  collapsed={false}
  items={[
    { id: '1', label: 'Home', icon: <HomeIcon />, path: '/' },
    { id: '2', label: 'About', icon: <InfoIcon />, path: '/about' },
  ]}
/>
```

### Sidebar with Sections

```tsx
<BaseSidebar
  collapsed={false}
  sections={[
    {
      id: 'main',
      title: 'Main',
      items: [
        { id: '1', label: 'Home', icon: <HomeIcon />, path: '/' },
      ],
    },
    {
      id: 'settings',
      title: 'Settings',
      items: [
        { id: '2', label: 'Profile', icon: <PersonIcon />, path: '/profile' },
      ],
    },
  ]}
/>
```

### Sidebar with Groups

```tsx
<BaseSidebar
  collapsed={false}
  groups={[
    {
      id: 'primary',
      sections: [
        {
          id: 'nav',
          items: [
            { id: '1', label: 'Home', icon: <HomeIcon />, path: '/' },
          ],
        },
      ],
    },
  ]}
/>
```

## Integration with Layout

The sidebar integrates with the `GlobalHeader` component through the `collapsed` prop:

```tsx
const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

<GlobalHeader
  onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
  sidebarCollapsed={sidebarCollapsed}
/>

<NavigationSidebar collapsed={sidebarCollapsed} />
```

