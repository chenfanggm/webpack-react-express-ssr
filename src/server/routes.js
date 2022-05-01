import React from 'react'
import express from 'express'
import { StaticRouter } from 'react-router-dom/server'
import { renderToString } from 'react-dom/server'
import App from '@components/app/app'
import assets from '@dist/server/assets.json'
import { createStore } from 'redux'
import reducers from '@reducers'

const router = express.Router()

/* GET all pages */
router.get('/*', (req, res) => {
  // Redirect
  // if (req.url === '/some-page') {
  //   return res.redirect(301, '/')
  // }

  const helmetContext = {}

  const initialReduxState = {
    global: { foo: 0 },
  }
  const store = createStore(reducers, initialReduxState)

  const appString = renderToString(
    <App
      Router={StaticRouter}
      routerProps={{
        location: req.originalUrl,
      }}
      store={store}
      helmetContext={helmetContext}
    />
  )

  const preloadedState = store.getState()

  const { helmet } = helmetContext

  res.render('index', {
    appString,
    titleTag: helmet.title.toString(),
    preloadedState,
    assets,
  })
})

export default router
