import type { WarpCard } from '@/components/ui/warp-carousel'

/*
 * The four "Review at a glance" cards. Numbers and labels come ONLY from the sample prototype
 * (Project Harbor): 3 recipients compared, 2 things to fix, 1 tap to send, 4 message states.
 * Mesh colours: 7 per card (the component spreads them over its 6×7 grid), tokens from the Figma variables.
 */
export const reviewCards: WarpCard[] = [
  {
    title: 'Recipients\ncompared',
    value: '3',
    detail: 'none',
    numeral: ['#B7ACFF', '#F2F4F8'],
    accent: '#7FB4FF',
    glow: '#2B3190',
    // card 1: indigo / soft blue
    mesh: ['#0D1233', '#141A44', '#1B2A7A', '#25297A', '#2B3190', '#3A5BD0', '#7FB4FF'],
  },
  {
    title: 'Things to fix\nbefore Send',
    value: '2',
    detail: 'none',
    numeral: ['#B7ACFF', '#F2F4F8'],
    accent: '#B7ACFF',
    glow: '#9B8CFF',
    // card 2: lavender
    mesh: ['#241B55', '#4A3A9E', '#6A55D0', '#9B8CFF', '#B7ACFF', '#7A64E6', '#2A2160'],
  },
  {
    title: 'Tap\nto send',
    value: '1',
    detail: 'none',
    numeral: ['#B7ACFF', '#F2F4F8'],
    accent: '#9B8CFF',
    glow: '#25297A',
    // card 3: deep indigo
    mesh: ['#050719', '#0D1233', '#141A44', '#1A2060', '#25297A', '#10153A', '#070A24'],
  },
  {
    title: 'Message\nstates',
    value: '4',
    footer: 'Ready · Pending · Sent · Outdated',
    detail: 'none',
    numeral: ['#B7ACFF', '#F2F4F8'],
    accent: '#B7ACFF',
    glow: '#3A3FC0',
    // card 4: violet
    mesh: ['#1D0B45', '#2B1060', '#4B1FA0', '#6941E1', '#916BBF', '#B08CE8', '#5A2FC0'],
  },
]
