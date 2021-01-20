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
        <p>
          <a
            rel="noreferrer"
            href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
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
            rel="noreferrer"
            href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
          >
            Creative Commons Attribution-NonCommercial-ShareAlike 4.0
            International License
          </a>
          .
        </p>
        <p>
          <a href="/rss.xml" rel="noreferrer" target="_blank">
            subscribe to the RSS feed
          </a>
        </p>
      </footer>
    </div>
  )
}

export default Layout
