'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'

export default function Header() {
  const pathname = usePathname()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(path)
  }

  const handleMenuEnter = (menu: string) => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current)
      menuTimeoutRef.current = null
    }
    setActiveMenu(menu)
  }

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null)
    }, 150)
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            <h1>GETL</h1>
            <span className={styles.tagline}>Portal</span>
          </Link>
        </div>
        <nav className={styles.nav}>
          <Link 
            href="/" 
            className={isActive('/') && !pathname?.startsWith('/uhnwi') && !pathname?.startsWith('/vcs') ? styles.navButtonActive : styles.navButton}
          >
            Dashboard
          </Link>
          <div 
            className={styles.menuItem}
            onMouseEnter={() => handleMenuEnter('capital')}
            onMouseLeave={handleMenuLeave}
          >
            <button className={styles.navButton}>
              Capital
              <span className={styles.dropdownArrow}>▼</span>
            </button>
            {activeMenu === 'capital' && (
              <div 
                className={styles.dropdownMenu}
                onMouseEnter={() => handleMenuEnter('capital')}
                onMouseLeave={handleMenuLeave}
              >
                <Link 
                  href="/uhnwi" 
                  className={`${styles.dropdownItem} ${isActive('/uhnwi') ? styles.dropdownItemActive : ''}`}
                >
                  UHNWI
                </Link>
                <Link 
                  href="/vcs" 
                  className={`${styles.dropdownItem} ${isActive('/vcs') ? styles.dropdownItemActive : ''}`}
                >
                  Venture Capital
                </Link>
                <Link 
                  href="/definitions" 
                  className={`${styles.dropdownItem} ${isActive('/definitions') ? styles.dropdownItemActive : ''}`}
                >
                  Definitions
                </Link>
              </div>
            )}
          </div>
          <div 
            className={styles.menuItem}
            onMouseEnter={() => handleMenuEnter('reviewing')}
            onMouseLeave={handleMenuLeave}
          >
            <button className={styles.navButton}>
              Deal Review
              <span className={styles.dropdownArrow}>▼</span>
            </button>
            {activeMenu === 'reviewing' && (
              <div 
                className={styles.dropdownMenu}
                onMouseEnter={() => handleMenuEnter('reviewing')}
                onMouseLeave={handleMenuLeave}
              >
                <Link href="#" className={styles.dropdownItem}>Pending Reviews</Link>
                <Link href="#" className={styles.dropdownItem}>My Reviews</Link>
                <Link href="#" className={styles.dropdownItem}>Review History</Link>
                <Link href="#" className={styles.dropdownItem}>Review Settings</Link>
              </div>
            )}
          </div>
          <Link 
            href="/company-documents" 
            className={isActive('/company-documents') ? styles.navButtonActive : styles.navButton}
          >
            Company Documents
          </Link>
          <div 
            className={styles.menuItem}
            onMouseEnter={() => handleMenuEnter('dealRooms')}
            onMouseLeave={handleMenuLeave}
          >
          <Link 
            href="/deal-rooms" 
            className={isActive('/deal-rooms') ? styles.navButtonActive : styles.navButton}
          >
            Deal Rooms
              <span className={styles.dropdownArrow}>▼</span>
            </Link>
            {activeMenu === 'dealRooms' && (
              <div 
                className={styles.dropdownMenu}
                onMouseEnter={() => handleMenuEnter('dealRooms')}
                onMouseLeave={handleMenuLeave}
              >
                <Link 
                  href="/deal-rooms" 
                  className={`${styles.dropdownItem} ${isActive('/deal-rooms') && !pathname?.includes('/add') && !pathname?.includes('/edit') ? styles.dropdownItemActive : ''}`}
                >
                  View All Deal Rooms
                </Link>
                <Link 
                  href="/deal-rooms/add" 
                  className={`${styles.dropdownItem} ${isActive('/deal-rooms/add') ? styles.dropdownItemActive : ''}`}
                >
                  + Add New Deal Room
          </Link>
              </div>
            )}
          </div>
          <Link 
            href="#" 
            className={styles.navButton}
          >
            Documentation
          </Link>
          <Link 
            href="#" 
            className={styles.navButton}
          >
            Support
          </Link>
        </nav>
      </div>
    </header>
  )
}

