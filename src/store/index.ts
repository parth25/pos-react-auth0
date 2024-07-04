// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import user from 'src/store/user'
import app from 'src/store/app'

import content from 'src/store/content'

import company from 'src/store/company'
import settings from 'src/store/settings'
import publicStore from 'src/store/public'

export const store = configureStore({
  reducer: {
    user,
    company,
    app,
    content,
    settings,
    publicStore
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
