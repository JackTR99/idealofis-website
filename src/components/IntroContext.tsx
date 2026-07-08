import { createContext, useContext } from 'react'

/** Intro oynarken sayfa "chrome"unu (navbar + footer) gizlemek için köprü. */
type IntroState = {
  introActive: boolean
  setIntroActive: (v: boolean) => void
}

export const IntroContext = createContext<IntroState>({
  introActive: false,
  setIntroActive: () => {},
})

export const useIntro = () => useContext(IntroContext)
