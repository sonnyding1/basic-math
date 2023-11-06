import 'mathlive'
import Script from 'next/script'
import { useEffect } from 'react';

export default function ProblemsLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div>
        <Script src='//unpkg.com/mathlive' />
        <Script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" />
        {children}
      </div>
    )
  }
  