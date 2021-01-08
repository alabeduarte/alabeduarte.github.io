/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
        childImageSharp {
          fixed(width: 50, height: 50, quality: 95) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social

  const avatar = data?.avatar?.childImageSharp?.fixed

  return (
    <>
      <div className="bio">
        <Image
          fixed={avatar}
          alt={author.name}
          className="bio-avatar"
          imgStyle={{ borderRadius: `50%` }}
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
            .
          </span>
          <p>
            <ul>
              <li>
                <a href={`https://twitter.com/${social.twitter || ``}`}>
                  @alabeduarte at Twitter
                </a>
              </li>
              <li>
                <a href={`https://github.com/${social.github || ``}`}>
                  @alabeduarte at GitHub
                </a>
              </li>
            </ul>
          </p>
        </div>
      </div>
    </>
  )
}

export default Bio
