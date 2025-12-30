'use client'

import React from 'react'

import { Globe, Menu, Home, Users, UserPlus, Plus, Library } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { Logo } from '@/shared/assets/icons'

import { BurgerMenuRentHandbookRoutes, BurgerMenuRentRoutes } from '../model/main-header-menu-routes'

import cls from './main-header.module.css'

type MegaTabValue = 'rent' | 'coLiving' | 'forms'
type LocaleValue = 'ru' | 'en' | 'kg'

export const MainHeader: React.FC = () => {
  const t = useTranslations('HomePage.Header')

  const pathname = usePathname()
  const router = useRouter()

  const [isMegaMenuOpen, setIsMegaMenuOpen] = React.useState(false)
  const [activeMegaTab, setActiveMegaTab] = React.useState<MegaTabValue>('rent')

  const closeTimeoutIdRef = React.useRef<number | null>(null)
  const isPointerOverBurgerRef = React.useRef(false)
  const [isHoverOpenBlocked, setIsHoverOpenBlocked] = React.useState(false)

  const cancelScheduledClose = React.useCallback(() => {
    if (closeTimeoutIdRef.current !== null) {
      window.clearTimeout(closeTimeoutIdRef.current)
      closeTimeoutIdRef.current = null
    }
  }, [])

  const closeMegaMenu = React.useCallback(() => {
    cancelScheduledClose()
    setIsMegaMenuOpen(false)
  }, [cancelScheduledClose])

  const openMegaMenu = React.useCallback(() => {
    cancelScheduledClose()
    setIsMegaMenuOpen(true)
  }, [cancelScheduledClose])

  const scheduleClose = React.useCallback(() => {
    cancelScheduledClose()
    closeTimeoutIdRef.current = window.setTimeout(() => {
      setIsMegaMenuOpen(false)
    }, 1500)
  }, [cancelScheduledClose])

  const handleBurgerPointerEnter = React.useCallback(() => {
    isPointerOverBurgerRef.current = true
    cancelScheduledClose()

    if (isHoverOpenBlocked) return

    setIsMegaMenuOpen(true)
  }, [cancelScheduledClose, isHoverOpenBlocked])

  const handleBurgerPointerLeave = React.useCallback(() => {
    isPointerOverBurgerRef.current = false

    setIsHoverOpenBlocked(false)

    scheduleClose()
  }, [scheduleClose])

  const handleBurgerClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (isMegaMenuOpen) {
        closeMegaMenu()

        if (isPointerOverBurgerRef.current) setIsHoverOpenBlocked(true)

        return
      }

      setIsHoverOpenBlocked(false)
      openMegaMenu()
    },
    [isMegaMenuOpen, closeMegaMenu, openMegaMenu],
  )

  const changeLocale = React.useCallback(
    (nextLocale: LocaleValue) => {
      router.replace(pathname, { locale: nextLocale })
    },
    [router, pathname],
  )

  return (
    <header className={cls.header}>
      <div className={`${cls.navbar} container`}>
        <div className={cls.logo}>
          <Logo />
          <span className={cls.logoText}>bolmo</span>
        </div>

        <nav className={cls.centerNav}>
          <Link
            href="/rent"
            className={`${cls.navLink} ${pathname.startsWith('/rent') ? cls.navLinkActive : ''}`}
          >
            <Home size={16} />
            <span>{t('nav.rent')}</span>
          </Link>

          <Link
            href="/co-living"
            className={`${cls.navLink} ${pathname.startsWith('/co-living') ? cls.navLinkActive : ''}`}
          >
            <Users size={16} />
            <span>{t('nav.coLiving')}</span>
          </Link>

          <Link
            href="/roommate"
            className={`${cls.navLink} ${pathname.startsWith('/roommate') ? cls.navLinkActive : ''}`}
          >
            <UserPlus size={16} />
            <span>{t('nav.roommate')}</span>
          </Link>
        </nav>

        <div className={cls.rightSide}>
          <Button size={'pill'} variant="ghost" className={cls.postButton}>
            <Plus size={16} />
            <span>{t('actions.postAd')}</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cls.iconButton} aria-label={t('actions.language')}>
                <Globe size={18} />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className={cls.dropdownMenuContentCustom} align="end">
              <DropdownMenuItem onClick={() => changeLocale('ru')}>
                Русский
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLocale('kg')}>
                Кыргызча
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLocale('en')}>
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div
            className={cls.burgerWrap}
            onPointerEnter={handleBurgerPointerEnter}
            onPointerLeave={handleBurgerPointerLeave}
          >
            <button
              className={`${cls.iconButton} ${cls.burgerButton} ${isMegaMenuOpen ? cls.iconButtonActive : ''}`}
              aria-label={t('actions.menu')}
              type="button"
              onClick={handleBurgerClick}
            >
              <Menu size={18} />
              <span className={cls.closeIcon} />
            </button>
          </div>

        </div>
      </div>

      {isMegaMenuOpen && (
        <div className={cls.megaOverlay}>
          <button
            className={cls.megaBackdrop}
            type="button"
            aria-label={t('actions.menu')}
            onMouseDown={closeMegaMenu}
          />

          <div
            className={cls.megaPanelWrap}
            onPointerEnter={cancelScheduledClose}
            onPointerLeave={scheduleClose}
          >
            <div className={`${cls.megaPanel} container`}>
              <Tabs value={activeMegaTab} onValueChange={(v) => setActiveMegaTab(v as MegaTabValue)}>
                <TabsList className={cls.megaTabsList}>
                  <TabsTrigger className={cls.megaTab} value="rent">
                    {t('megaTabs.rent')}
                  </TabsTrigger>
                  <TabsTrigger className={cls.megaTab} value="coLiving">
                    {t('megaTabs.coLiving')}
                  </TabsTrigger>
                  <TabsTrigger className={cls.megaTab} value="forms">
                    {t('megaTabs.forms')}
                  </TabsTrigger>
                </TabsList>

                <TabsContent className={cls.megaContent} value="rent">
                  <div className={cls.megaGrid}>
                    <div className={cls.leftCol}>
                      {BurgerMenuRentRoutes.map((item, index) => (
                        <Link key={index} className={cls.menuItem} href={item.href}>
                          {t(`rent.${item.key}`)}
                        </Link>
                      ))}
                    </div>

                    <div className={cls.middleCol}>
                      {BurgerMenuRentHandbookRoutes.map((item, index) => (
                        <Link key={index} className={cls.journalItem} href={item.href}>
                          <Library size={16} className={cls.journalIcon}/>
                          <span>{t(`journal.${item.key}`)}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent className={cls.megaContent} value="coLiving">
                  <div className={cls.megaGrid}>
                    <div className={cls.leftCol}>
                      {BurgerMenuRentRoutes.map((item, index) => (
                        <Link key={index} className={cls.menuItem} href={item.href}>
                          {t(`rent.${item.key}`)}
                        </Link>
                      ))}
                    </div>

                    <div className={cls.middleCol}>
                      {BurgerMenuRentHandbookRoutes.map((item, index) => (
                        <Link key={index} className={cls.journalItem} href={item.href}>
                          <Library size={16} className={cls.journalIcon}/>
                          <span>{t(`journal.${item.key}`)}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent className={cls.megaContent} value="forms">
                  <div className={cls.megaGrid}>
                    <div className={cls.leftCol}>
                      {BurgerMenuRentRoutes.map((item, index) => (
                        <Link key={index} className={cls.menuItem} href={item.href}>
                          {t(`rent.${item.key}`)}
                        </Link>
                      ))}
                    </div>

                    <div className={cls.middleCol}>
                      {BurgerMenuRentHandbookRoutes.map((item, index) => (
                        <Link key={index} className={cls.journalItem} href={item.href}>
                          <Library size={16} className={cls.journalIcon}/>
                          <span>{t(`journal.${item.key}`)}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
