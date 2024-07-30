import { ThemeProvider } from '@shadcn/components/theme-provider'
import { Button } from '@shadcn/components/ui/button'

export function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='shadcn-ui-theme'>
      <div className='flex justify-center items-center'>
        <Button>aaa</Button>
      </div>
    </ThemeProvider>
  )

}

export default App
