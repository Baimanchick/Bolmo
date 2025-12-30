interface MainHeaderBurgerMenuRoutesTypes {
    key: string
    href: string
}

export const BurgerMenuRentRoutes: MainHeaderBurgerMenuRoutesTypes[] = [
  {
    key: 'long',
    href: '/rent/long',
  },
  {
    key: 'flats',
    href: '/rent/flats',
  },
  {
    key: 'room',
    href: '/rent/rooms',
  },
  {
    key: 'houses',
    href: '/rent/houses',
  },
  {
    key: 'daily',
    href: '/rent/daily',
  },
  {
    key: 'leaseOut',
    href: '/rent/lease-out',
  },
]

export const BurgerMenuRentHandbookRoutes: MainHeaderBurgerMenuRoutesTypes[] = [
  {
    key: 'rent',
    href: '/journal/rent',
  },
  {
    key: 'coLiving',
    href: '/journal/co-living',
  },
  {
    key: 'forms',
    href: '/journal/forms',
  },
]
