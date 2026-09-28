// Town centroids, so a county page can draw its own map of where the care services are.
//
// CareAssura stores a postcode for every service but no latitude or longitude, so these
// are geocoded once from a representative postcode per town via postcodes.io and written
// to town-coords.generated.json by scripts/build-counties.mjs. A town without an entry is
// simply not plotted, which is the safe failure: a missing dot beats a wrong one.
//
// Keys are normalised town names: lowercased, punctuation replaced with single spaces
// (see normaliseTown in lib/locations.ts).

import generated from './town-coords.generated.json'

export type LatLng = [lat: number, lng: number]

export const TOWN_COORDS = generated as unknown as Record<string, Record<string, LatLng>>

/**
 * Misspellings in the register that are plainly the same town, so they are counted once.
 * Only for cases that are unambiguous. Kept in step with the copy in the build script.
 */
export const TOWN_ALIASES: Record<string, string> = {
  waterloovile: 'waterlooville',
}

/**
 * Display spellings for towns whose normalised key loses its punctuation. Only needed
 * where title case plus the small word rule below still gets it wrong.
 */
export const TOWN_DISPLAY: Record<string, string> = {
  'shoreham by sea': 'Shoreham-by-Sea',
  'middleton on sea': 'Middleton-on-Sea',
  'bexhill on sea': 'Bexhill-on-Sea',
  'st leonards on sea': 'St Leonards-on-Sea',
  'southend on sea': 'Southend-on-Sea',
  'westgate on sea': 'Westgate-on-Sea',
  'lee on the solent': 'Lee-on-the-Solent',
  'stoke on trent': 'Stoke-on-Trent',
  'nr petersfield': 'Near Petersfield',
  'nr hook': 'Near Hook',
}

/** Words that stay lowercase inside a town name, so "stoke on trent" is not "Stoke On Trent". */
export const SMALL_WORDS = new Set(['on', 'upon', 'under', 'in', 'le', 'by', 'the', 'of', 'and'])
