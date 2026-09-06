import { BrandMark } from './BrandMark'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <span className="site-footer__brand">
          <BrandMark size={22} />
          ESCAPE
        </span>
        <p className="site-footer__rights">
          &copy; {new Date().getFullYear()} ESCAPE Weekend Trip Planner. All rights
          reserved.
        </p>
      </div>
    </footer>
  )
}