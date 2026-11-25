import { footer } from '@/content/copy'
import { Logo } from '@/components/bits'

/** 4 columns + legal line. Per the brief: no Terms / Privacy links. Copy from Figma (B7 · Footer). */
export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-bg-deep">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1.4fr_1fr] lg:px-[120px] lg:py-[70px]">
        <div>
          <Logo />
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-7 gap-y-1 lg:flex-col lg:gap-y-0">
            {footer.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="flex min-h-[44px] items-center text-[15px] font-medium text-text/80 transition-colors hover:text-text">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="max-w-[460px] text-[14px] leading-[1.5] text-muted">{footer.disclaimer}</p>
        <p className="text-[14px] leading-[1.5] text-muted/80">{footer.legal}</p>
      </div>
    </footer>
  )
}
