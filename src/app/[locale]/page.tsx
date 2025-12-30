import React from 'react'

import { getTranslations } from 'next-intl/server'

import { MainHeader } from '@/widgets/main-header/ui/main-header'

import type { Metadata } from 'next'

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default function Home() {

  return (
    <main className="container">
      <MainHeader/>
      <h1>Hello</h1>
    </main>
  )
}
