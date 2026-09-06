import { BrandMark } from './BrandMark'

const NAV_LINKS = [
  { href: '#destinations', label: 'Destinations' },
  { href: '#trip', label: 'My Trip' },
] as const

export function Header() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="site-header__inner">
        <a className="brand" href="#top" aria-label="ESCAPE — back to top">
          <BrandMark />
          <span className="brand__name">ESCAPE</span>
          <span className="brand__tag">weekend trips</span>
        </a>
        <nav aria-label="Primary">
          <ul className="site-nav">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a className="site-nav__link" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}