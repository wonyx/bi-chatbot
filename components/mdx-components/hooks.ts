import { useTheme } from 'next-themes'
export function useLegend() {
  const { resolvedTheme } = useTheme()
  return {
    textStyle: {
      color: resolvedTheme === 'dark' ? '#ccc' : '#333',
    },
  }
}
