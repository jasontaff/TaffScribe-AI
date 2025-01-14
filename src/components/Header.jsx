import React from 'react'

export default function Header() {
  return (
    <header className='flex items-center justify-between gap-4 p-4'>
    <h1 className="font-medium">Taff<span className='text-blue-400 bold'>Scribe</span>-AI</h1>
    <button className='flex items-center gap-2 specialBtn px-3 py-2 rounder-lg text-blue-400'>
      <p>New</p>
      <i className='fa-solid fa-plus'></i>
    </button>
  </header>
  )
}
