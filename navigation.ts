import {createNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['fr', 'en'],
  // Used when no locale matches
  defaultLocale: 'fr'
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);













