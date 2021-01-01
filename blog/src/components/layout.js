import React from "react"
import { Link } from "gatsby"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        <a
          rel="license"
          href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
        >
          <img
            alt="Creative Commons License"
            style={{ borderWidth: 0 }}
            src="https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png"
          />
        </a>
        <br />
        This work is licensed under a{" "}
        <a
          rel="license"
          href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
        >
          Creative Commons Attribution-NonCommercial-ShareAlike 4.0
          International License
        </a>
        .
      </footer>
    </div>
  )
}

export default Layout
