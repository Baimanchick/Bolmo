import React from 'react'

import styles from './style.module.css'

const Header = () => {
  return (
    <header className={styles.header}>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className={styles.logo}>
              Bolmo
            </div>
            <div className={styles.tag}>Поиск сожителей</div>
          </div>
        </div>
        <div className="flex-none">
          <button className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /> </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
