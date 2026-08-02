import Footer from '@/components/share/Footer'
import { Header } from '@/components/Header'
import { Navigation } from '@/components/Navigation'
import React from 'react'

export default function layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <Navigation />
      {children}
      <Footer />
    </>
  )
}
