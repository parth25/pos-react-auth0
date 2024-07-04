// ** React Import
import { Children } from 'react'

// ** Next Import
import Document, { Head, Html, Main, NextScript } from 'next/document'

// ** Emotion Imports
import createEmotionServer from '@emotion/server/create-instance'

// ** Utils Imports

class CustomDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <meta property='og:url' content='https://masernet.com/' />
          <meta property='og:title' content='Matching leads from your markets' />
          <meta
            property='og:description'
            content='Boost your sales with automated matching of tenders with your portfolio!'
          />
          <meta property='og:image' content='/images/home-page.png' />
          <meta property='og:site_name' content='masernet' />
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap'
          />
          <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/driver.js/dist/driver.css' />

          <link rel='apple-touch-icon' sizes='180x180' href='/images/masernet-logo.svg' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

CustomDocument.getInitialProps = async ctx => {
  const originalRenderPage = ctx.renderPage

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props =>
        (
          <App
            {...props} // @ts-ignore
          />
        )
    })

  const initialProps = await Document.getInitialProps(ctx)

  return {
    ...initialProps,
    styles: [...Children.toArray(initialProps.styles)]
  }
}

export default CustomDocument
