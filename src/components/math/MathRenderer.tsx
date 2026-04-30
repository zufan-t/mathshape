import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

interface MathRendererProps {
  math: string
  block?: boolean
}

/**
 * Komponen untuk me-render rumus matematika menggunakan KaTeX
 */
export default function MathRenderer({ math, block = false }: MathRendererProps) {
  try {
    if (block) {
      return <div className="my-4 overflow-x-auto"><BlockMath math={math} /></div>
    }
    return <InlineMath math={math} />
  } catch (error) {
    console.error('KaTeX error:', error)
    return <span className="text-red-500">{math}</span>
  }
}
