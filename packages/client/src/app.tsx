import { ThemeProvider } from '@shadcn/components/theme-provider'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'

export function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='shadcn-ui-theme'>
      <RouterProvider router={router} />
    </ThemeProvider>
  )

}

export default App
