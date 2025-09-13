/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
            github
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social

  return (
    <>
      <div className="bio">
        <StaticImage
          src="../../content/assets/profile-pic.jpg"
          alt={author?.name || "Profile"}
          className="bio-avatar"
          placeholder="blurred"
          layout="fixed"
          width={50}
          height={50}
          quality={95}
          style={{
            borderRadius: `50%`,
          }}
        />
        <div className="bio-social">
          <span>
            Written by <strong>{author.name}</strong>, {author.summary} at{" "}
            <a
              href="https://safetyculture.com"
              target="_blank"
              rel="noreferrer"
            >
              SafetyCulture
            </a>
            , formerly{" "}
            <a
              href="https://www.thoughtworks.com/"
              target="_blank"
              rel="noreferrer"
            >
              ThoughtWorks
            </a>
            .
          </span>
          <p>Opinions are mine.</p>
          <ul>
            <li>
              <a href={`https://twitter.com/${social.twitter}`}>
                @alabeduarte on Twitter
              </a>
            </li>
            <li>
              <a href={`https://github.com/${social.github}`}>
                @alabeduarte on GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default Bio
