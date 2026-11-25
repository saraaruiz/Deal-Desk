import { cn } from '@/lib/utils'

/*
 * Illustrated, Memoji-style avatars for the fictional people in the prototype (Jordan, Pat, Alex, Dana, Sam).
 * Flat vector faces generated here, so there are no photos of real people and no extra image requests.
 * Each avatar is returned as an SVG data URI (usable as <img src> and as the Team Invite `src`).
 */
type Hair = 'short' | 'long' | 'bun' | 'curly' | 'wave'
interface Spec {
  bg: [string, string]
  skin: string
  hair: string
  hairStyle: Hair
  shirt: string
  glasses?: boolean
}

const specs: Record<string, Spec> = {
  jordan: { bg: ['#C9A2FF', '#5F8CF2'], skin: '#EDBB99', hair: '#3B2A22', hairStyle: 'short', shirt: '#0D1233', glasses: true },
  pat: { bg: ['#7FB4FF', '#3A3FC0'], skin: '#C68B66', hair: '#15151B', hairStyle: 'short', shirt: '#25297A' },
  alex: { bg: ['#B7ACFF', '#6941E1'], skin: '#F3D0B5', hair: '#9A4B2A', hairStyle: 'long', shirt: '#141A44' },
  dana: { bg: ['#9B8CFF', '#2B3190'], skin: '#8D5A3C', hair: '#1A1216', hairStyle: 'bun', shirt: '#2A2160' },
  sam: { bg: ['#A9B1C0', '#4A5072'], skin: '#F0C7A5', hair: '#D9B35F', hairStyle: 'curly', shirt: '#171A21' },
  priya: { bg: ['#C9A2FF', '#6941E1'], skin: '#B97A56', hair: '#1A1216', hairStyle: 'long', shirt: '#25297A' },
  maya: { bg: ['#7FB4FF', '#25297A'], skin: '#E8B796', hair: '#15151B', hairStyle: 'bun', shirt: '#0D1233', glasses: true },
  leo: { bg: ['#9B8CFF', '#3A3FC0'], skin: '#F3D0B5', hair: '#6B3A22', hairStyle: 'short', shirt: '#171A21' },
  adrian: { bg: ['#B7ACFF', '#2B3190'], skin: '#D9A07A', hair: '#2A1B14', hairStyle: 'curly', shirt: '#141A44' },
}

function hairBack(s: Spec) {
  if (s.hairStyle === 'long') return `<path d="M33 54C33 28 45 17 60 17s27 11 27 37v30c0 5-5 8-10 5V58H43v26c-5 3-10 0-10-5z" fill="${s.hair}"/>`
  if (s.hairStyle === 'bun') return `<circle cx="60" cy="17" r="11" fill="${s.hair}"/>`
  return ''
}
function hairFront(s: Spec) {
  switch (s.hairStyle) {
    case 'curly':
      return `<g fill="${s.hair}"><circle cx="40" cy="38" r="10"/><circle cx="52" cy="30" r="11"/><circle cx="66" cy="29" r="11"/><circle cx="79" cy="38" r="10"/><circle cx="60" cy="38" r="12"/></g>`
    case 'wave':
    case 'long':
    case 'short':
    case 'bun':
    default:
      return `<path d="M35 52C34 31 46 23 60 23s26 8 25 29c-4-10-10-15-25-15S39 42 35 52z" fill="${s.hair}"/>`
  }
}

export function avatarSvg(name: keyof typeof specs | string) {
  const s = specs[name] ?? specs.jordan
  const g = `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${s.bg[0]}"/><stop offset="1" stop-color="${s.bg[1]}"/></linearGradient></defs>`
  const glasses = s.glasses
    ? `<g fill="none" stroke="#0D1233" stroke-width="2"><circle cx="50" cy="56" r="7"/><circle cx="70" cy="56" r="7"/><path d="M57 56h6"/></g>`
    : ''
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">${g}<rect width="120" height="120" fill="url(#g)"/>` +
    hairBack(s) +
    `<path d="M14 124c0-28 21-42 46-42s46 14 46 42z" fill="${s.shirt}"/>` +
    `<rect x="52" y="72" width="16" height="14" rx="6" fill="${s.skin}" opacity=".92"/>` +
    `<ellipse cx="60" cy="56" rx="24" ry="27" fill="${s.skin}"/>` +
    hairFront(s) +
    `<circle cx="50" cy="57" r="2.6" fill="#1b1220"/><circle cx="70" cy="57" r="2.6" fill="#1b1220"/>` +
    glasses +
    `<path d="M52 68q8 7 16 0" fill="none" stroke="#1b1220" stroke-width="2.4" stroke-linecap="round"/>` +
    `<circle cx="44" cy="66" r="4.5" fill="#ff8f8f" opacity=".22"/><circle cx="76" cy="66" r="4.5" fill="#ff8f8f" opacity=".22"/>` +
    `</svg>`
  )
}

export const avatarUri = (name: string) => `data:image/svg+xml;utf8,${encodeURIComponent(avatarSvg(name))}`

/** Round avatar: fixed square, never squashed by flex layouts. */
export function Avatar({
  name,
  size = 56,
  className,
  ring,
  dashed,
}: {
  name: keyof typeof specs
  size?: number
  className?: string
  ring?: string
  dashed?: boolean
}) {
  return (
    <span
      aria-hidden
      className={cn('inline-block aspect-square shrink-0 overflow-hidden rounded-full', dashed && 'opacity-80', className)}
      style={{ width: size, height: size, boxShadow: `0 0 0 2px ${ring ?? 'rgba(255,255,255,.14)'}`, outline: dashed ? '2px dashed rgba(183,172,255,.7)' : undefined, outlineOffset: dashed ? 3 : undefined }}
    >
      <img src={avatarUri(name)} alt="" width={size} height={size} draggable={false} className="block size-full" />
    </span>
  )
}
