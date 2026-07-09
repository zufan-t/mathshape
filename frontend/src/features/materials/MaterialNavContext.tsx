import { createContext, useContext, useState, type ReactNode } from 'react'

interface MaterialNavData {
  sectionLabels: string[]
  revealedUpTo: number
  progressPercent: number
  onSectionClick: (idx: number) => void
  onExit: () => void
}

interface MaterialNavContextType {
  navData: MaterialNavData | null
  setNavData: (data: MaterialNavData | null) => void
}

const MaterialNavContext = createContext<MaterialNavContextType>({
  navData: null,
  setNavData: () => {},
})

export function MaterialNavProvider({ children }: { children: ReactNode }) {
  const [navData, setNavData] = useState<MaterialNavData | null>(null)
  return (
    <MaterialNavContext.Provider value={{ navData, setNavData }}>
      {children}
    </MaterialNavContext.Provider>
  )
}

export function useMaterialNav() {
  return useContext(MaterialNavContext)
}
