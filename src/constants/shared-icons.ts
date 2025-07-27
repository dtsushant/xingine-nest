import { IconMeta } from 'xingine';

/**
 * Shared icon constants for common UI elements
 * These can be reused across different layouts and components
 */

export const collapseIconMeta: IconMeta = {
  svg: {
    svg: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>`,
  },
};

export const homeIconMeta: IconMeta = {
  svg: {
    svg: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>`,
  },
};

export const searchIcon: IconMeta = {
  svg: {
    svg: `<svg
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-5 h-5 ">
                    <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>`,
  },
};

export const darkModeIcon: IconMeta = {
  svg: {
    svg: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>`,
  },
};

/**
 * Collection of all shared icons for easy access
 */
export const SharedIcons = {
  collapse: collapseIconMeta,
  home: homeIconMeta,
  search: searchIcon,
  darkMode: darkModeIcon,
};