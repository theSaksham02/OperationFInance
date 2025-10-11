import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { GlobeHemisphereEastIcon } from '@phosphor-icons/react/dist/ssr/GlobeHemisphereEast';
import { GlobeHemisphereWestIcon } from '@phosphor-icons/react/dist/ssr/GlobeHemisphereWest';

export const navIcons = {
  'globe-west': GlobeHemisphereWestIcon,
  'globe-east': GlobeHemisphereEastIcon,
} as Record<string, Icon>;
