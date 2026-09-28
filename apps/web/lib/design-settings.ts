// The eight care settings the design examples are grouped by. `pages` are the site pages
// for that setting, which link to its designs (home care covers domiciliary care too).

export type SettingKey =
  | 'care-homes'
  | 'nursing-homes'
  | 'dementia-care'
  | 'home-care'
  | 'live-in-care'
  | 'supported-living'
  | 'retirement-living'
  | 'care-groups'

export const DESIGN_SETTINGS: { key: SettingKey; label: string; pages: string[] }[] = [
  { key: 'care-homes', label: 'Care homes', pages: ['/care-homes'] },
  { key: 'nursing-homes', label: 'Nursing homes', pages: ['/nursing-homes'] },
  { key: 'dementia-care', label: 'Dementia care', pages: ['/dementia-care'] },
  { key: 'home-care', label: 'Home care', pages: ['/home-care', '/domiciliary-care'] },
  { key: 'live-in-care', label: 'Live-in care', pages: ['/live-in-care'] },
  { key: 'supported-living', label: 'Supported living', pages: ['/supported-living'] },
  { key: 'retirement-living', label: 'Retirement living', pages: ['/retirement-living'] },
  { key: 'care-groups', label: 'Care groups', pages: ['/care-groups'] },
]

export const settingLabel = (key: SettingKey) => DESIGN_SETTINGS.find((s) => s.key === key)?.label ?? key

/** The setting whose page this is, if any. */
export const settingForPage = (path: string) => DESIGN_SETTINGS.find((s) => s.pages.includes(path))
