import { PenLine, SendHorizontal, UserCheck } from 'lucide-react'
import { Avatar } from '@/lib/avatars'
import { cn } from '@/lib/utils'

/**
 * Who acts in each step of the review: an illustrated avatar with a small role icon (Coordinator, Deal owner),
 * the DealDesk mark, or the Send icon. Used inside "One message, four moments".
 */
export function RoleVisual({ name, size = 56, className }: { name: string; size?: number; className?: string }) {
  const small = size < 48
  const badge = cn(
    'absolute flex items-center justify-center rounded-full bg-lavender text-indigo ring-2 ring-bg',
    small ? '-bottom-1 -right-1 size-[18px]' : '-bottom-1 -right-1 size-6',
  )
  const icon = small ? 10 : 13
  if (name === 'Coordinator')
    return (
      <span className={cn('relative inline-block shrink-0', className)} style={{ width: size, height: size }}>
        <Avatar name="jordan" size={size} />
        <span className={badge}>
          <PenLine size={icon} strokeWidth={2.2} />
        </span>
      </span>
    )
  if (name === 'Deal owner')
    return (
      <span className={cn('relative inline-block shrink-0', className)} style={{ width: size, height: size }}>
        <Avatar name="dana" size={size} />
        <span className={badge}>
          <UserCheck size={icon} strokeWidth={2.2} />
        </span>
      </span>
    )
  if (name === 'DealDesk')
    return (
      <span className={cn('flex shrink-0 items-center justify-center rounded-full bg-lavender/15 ring-1 ring-lavender/50', className)} style={{ width: size, height: size }}>
        <img src="/assets/logo-mark.svg" alt="" width={size * 0.6} height={size * 0.4} style={{ width: size * 0.6, height: size * 0.4 }} />
      </span>
    )
  return (
    <span className={cn('flex shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-lavender-soft ring-1 ring-white/10', className)} style={{ width: size, height: size }}>
      <SendHorizontal size={size * 0.4} strokeWidth={1.8} />
    </span>
  )
}
