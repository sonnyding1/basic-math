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
      {/* <Script src='//unpkg.com/mathlive' /> */}
        {children}
    </div>
  )
}