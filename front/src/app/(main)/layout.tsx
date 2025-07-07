import type { Metadata } from 'next'
import '../globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: 'My Company',
  description: 'Welcome to our company',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <Navbar />
        <main>
          <div>{children}</div>
        </main>
        <Footer />
      </body>
    </html>
    
  )
} 