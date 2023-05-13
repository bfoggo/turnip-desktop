import Image from 'next/image'
import { Inter } from 'next/font/google'
import { invoke } from '@tauri-apps/api/tauri'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

const Greet = () => {
  useEffect(() => {
    invoke('say_hello').then(console.log).catch(console.error)
  }, [])
}

const list_campaigns = () => {
  useEffect(() => {
    invoke('list_campaigns').then(console.log).catch(console.error)
  }, [])
}

export default function Home() {
  Greet()
  list_campaigns()
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <li className="flex flex-col items-center justify-center">
      </li>
    </main>
  )
}
