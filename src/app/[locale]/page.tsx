import React from 'react'

import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'

import Header from '@/components/Header/Header'

import styles from './page.module.css'

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
  const t = useTranslations('HomePage')

  return (
    <React.Fragment>
      <Header/>
    </React.Fragment>
  )
}
