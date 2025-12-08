'use client'

import React from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, Eye, EyeOff, ArrowLeft, LockIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import styles from './page.module.css'

const validators = {
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    return emailRegex.test(value)
  },
  phone: (value: string): boolean => {
    const phoneRegex = /^\+?[1-9]\d{9,14}$/

    return phoneRegex.test(value.replace(/[\s-()]/g, ''))
  },
  password: (value: string): boolean => {
    return value.length >= 8
  },
  smsCode: (value: string): boolean => {
    return /^\d{4,6}$/.test(value)
  },
}

type AuthStep = 'initial' | 'email-register' | 'email-login' | 'phone-verify'
type ContactType = 'email' | 'phone' | null

const stepVariants: any = {
  forward: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  },
  back: {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, x: 100, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  },
}

const buttonVariants: any = {
  hover: { scale: 1.02, y: -2, transition: { type: 'spring', stiffness: 400, damping: 17 } },
  tap: { scale: 0.98, y: 0 },
}

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const staggerChild: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

export default function Auth() {
  const t = useTranslations('Auth')

  const [step, setStep] = React.useState<AuthStep>('initial')
  //   previousStep
  const [, setPreviousStep] = React.useState<AuthStep>('initial')
  const [direction, setDirection] = React.useState<'forward' | 'back'>('forward')
  const [contactValue, setContactValue] = React.useState('')
  const [contactType, setContactType] = React.useState<ContactType>(null)
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [smsCode, setSmsCode] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [agreedToTerms, setAgreedToTerms] = React.useState(false)
  const [wantsNewsletter, setWantsNewsletter] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = React.useState(false)

  const handleContactChange = React.useCallback((value: string) => {
    setContactValue(value)
    setErrors({})

    if (value.includes('@')) {
      setContactType('email')
    } else if (/^\+?\d/.test(value)) {
      setContactType('phone')
    } else {
      setContactType(null)
    }
  }, [])

  const validateInitialForm = React.useCallback((): boolean => {
    const newErrors: Record<string, string> = {}

    if (!contactValue.trim()) {
      newErrors.contact = t('errors.contactRequired')
    } else if (contactType === 'email' && !validators.email(contactValue)) {
      newErrors.contact = t('errors.invalidEmail')
    } else if (contactType === 'phone' && !validators.phone(contactValue)) {
      newErrors.contact = t('errors.invalidPhone')
    }

    if (!agreedToTerms) {
      newErrors.terms = t('errors.termsRequired')
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }, [contactValue, contactType, agreedToTerms, t])

  const handleInitialSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!validateInitialForm()) return

      setIsLoading(true)

      await new Promise(resolve => setTimeout(resolve, 1000))

      console.log('Initial submit:', {
        contact: contactValue,
        type: contactType,
        agreedToTerms,
        wantsNewsletter: contactType === 'email' ? wantsNewsletter : false,
      })

      const userExists = false

      setPreviousStep(step)
      if (contactType === 'email') {
        setStep(userExists ? 'email-login' : 'email-register')
      } else if (contactType === 'phone') {
        setStep('phone-verify')
      }

      setIsLoading(false)
    },
    [validateInitialForm, contactValue, contactType, agreedToTerms, wantsNewsletter, step],
  )

  const handleEmailRegister = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const newErrors: Record<string, string> = {}

      if (!validators.password(password)) {
        newErrors.password = t('errors.passwordTooShort')
      }

      if (confirmPassword && password !== confirmPassword) {
        newErrors.confirmPassword = t('errors.passwordsMismatch')
      }

      setErrors(newErrors)
      if (Object.keys(newErrors).length > 0) return

      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))

      console.log('Email registration:', {
        email: contactValue,
        password,
        confirmPassword,
      })

      alert(t('alerts.accountCreated'))
      setIsLoading(false)
    },
    [password, confirmPassword, contactValue, t],
  )

  const handleEmailLogin = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const newErrors: Record<string, string> = {}

      if (!password) {
        newErrors.password = t('errors.passwordRequired')
      }

      setErrors(newErrors)
      if (Object.keys(newErrors).length > 0) return

      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))

      console.log('Email login:', {
        email: contactValue,
        password,
      })

      alert(t('alerts.loginSuccess'))
      setIsLoading(false)
    },
    [password, contactValue, t],
  )

  const handlePhoneVerify = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const newErrors: Record<string, string> = {}

      if (!validators.smsCode(smsCode)) {
        newErrors.smsCode = t('errors.invalidSmsCode')
      }

      setErrors(newErrors)
      if (Object.keys(newErrors).length > 0) return

      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))

      console.log('Phone verification:', {
        phone: contactValue,
        code: smsCode,
      })

      alert(t('alerts.loginSuccess'))
      setIsLoading(false)
    },
    [smsCode, contactValue, t],
  )

  const handleBack = React.useCallback(() => {
    setDirection('back')
    setStep('initial')
    setPassword('')
    setConfirmPassword('')
    setSmsCode('')
    setErrors({})
  }, [])

  const handleGoogleAuth = React.useCallback(() => {
    console.log('Google authentication initiated')
    alert(t('alerts.googleAuthDev'))
  }, [t])

  const renderInitialStep = React.useMemo(
    () => (
      <motion.div
        className={styles.formContainer}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div className={styles.header} variants={staggerChild}>
          <motion.h1 className={styles.title} variants={staggerChild}>{t('header.welcome')}</motion.h1>
          <motion.p className={styles.subtitle} variants={staggerChild}>{t('header.subtitle')}</motion.p>
        </motion.div>

        <motion.form onSubmit={handleInitialSubmit} className={styles.form} variants={staggerChild}>
          <motion.div className={styles.inputGroup} variants={staggerChild}>
            <motion.label className={styles.label} variants={staggerChild}>{t('fields.contact.label')}</motion.label>
            <div className={styles.inputWrapper}>
              <div className={styles.inputIcon}>
                {contactType === 'email' ? <Mail className={styles.iconItem} size={20} /> : <Phone className={styles.iconItem} size={20} />}
              </div>
              <motion.input
                type="text"
                value={contactValue}
                onChange={e => handleContactChange(e.target.value)}
                placeholder={t('fields.contact.placeholder')}
                className={`${styles.input} ${errors.contact ? styles.inputError : ''}`}
                whileFocus="focus"
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            </div>
            {errors.contact && <motion.span className={styles.error} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors.contact}</motion.span>}
          </motion.div>

          <motion.div className={styles.checkboxGroup} variants={staggerChild}>
            <motion.label className={styles.checkboxLabel} whileHover={{ scale: 1.01 }}>
              <motion.input
                type="checkbox"
                checked={agreedToTerms}
                onChange={e => setAgreedToTerms(e.target.checked)}
                className={styles.checkbox}
              />
              <motion.span className={styles.checkboxText} whileHover={{ scale: 1.01 }}>
                {t('checkboxes.terms.prefix')}{' '}
                <a href="#" className={styles.link}>
                  {t('links.terms')}
                </a>
                ,{' '}
                <a href="#" className={styles.link}>
                  {t('links.privacy')}
                </a>{' '}
                {t('checkboxes.terms.and')}{' '}
                <a href="#" className={styles.link}>
                  {t('links.personalData')}
                </a>
              </motion.span>
            </motion.label>
            {errors.terms && <motion.span className={styles.error} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{errors.terms}</motion.span>}

            {contactType === 'email' && (
              <motion.label className={styles.checkboxLabel} whileHover={{ scale: 1.01 }}>
                <motion.input
                  type="checkbox"
                  checked={wantsNewsletter}
                  onChange={e => setWantsNewsletter(e.target.checked)}
                  className={styles.checkbox}
                />
                <motion.span className={styles.checkboxText} whileHover={{ scale: 1.01 }}>
                  {t('checkboxes.newsletter.label')}
                </motion.span>
              </motion.label>
            )}
          </motion.div>

          <motion.button
            type="submit"
            className={`${styles.button} ${styles.buttonPrimary}`}
            disabled={isLoading}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {isLoading ? t('buttons.loading') : t('buttons.continue')}
          </motion.button>

          <div className={styles.divider}>
            <span>{t('divider.or')}</span>
          </div>

          <motion.button
            type="button"
            onClick={handleGoogleAuth}
            className={`${styles.button} ${styles.buttonGoogle}`}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.351z"
                fill="#4285F4"
              />
              <path
                d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z"
                fill="#34A853"
              />
              <path
                d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49л3.34-2.59z"
                fill="#FBBC05"
              />
              <path
                d="M10 3.977c1.468 0 2.786.505 3.823 1.496л2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51л3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z"
                fill="#EA4335"
              />
            </svg>
            {t('buttons.google')}
          </motion.button>
        </motion.form>
      </motion.div>
    ),
    [
      contactValue,
      contactType,
      agreedToTerms,
      wantsNewsletter,
      errors,
      isLoading,
      handleContactChange,
      handleInitialSubmit,
      handleGoogleAuth,
      t,
    ],
  )

  const renderEmailRegister = React.useMemo(
    () => (
      <motion.div
        className={styles.formContainer}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.button onClick={handleBack} className={styles.backButton} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <ArrowLeft className={styles.iconItem} size={20} />
        </motion.button>

        <motion.div className={styles.header} variants={staggerChild}>
          <motion.h1 className={styles.title} variants={staggerChild}>{t('emailRegister.title')}</motion.h1>
          <motion.p className={styles.subtitle} variants={staggerChild}>
            {t('emailRegister.subtitle', { contactValue })}
          </motion.p>
        </motion.div>

        <motion.form onSubmit={handleEmailRegister} className={styles.form} variants={staggerChild}>
          <motion.div className={styles.inputGroup} variants={staggerChild}>
            <motion.label className={styles.label} variants={staggerChild}>{t('labels.password')}</motion.label>
            <div className={styles.inputWrapper}>
              <div className={styles.inputIcon}>
                <LockIcon className={styles.iconItem} size={20}/>
              </div>
              <motion.input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t('placeholders.passwordMin')}
                className={`${styles.input} ${
                  errors.password ? styles.inputError : ''
                }`}
                whileFocus="focus"
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eyeButton}
                whileHover={{ rotate: 180, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ rotate: { duration: 0.4 } }}
              >
                {showPassword ? <EyeOff className={styles.iconItem} size={20} /> : <Eye className={styles.iconItem} size={20} />}
              </motion.button>
            </div>
            {errors.password && <motion.span className={styles.error} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>{errors.password}</motion.span>}
          </motion.div>

          <motion.div className={styles.inputGroup} variants={staggerChild}>
            <motion.label className={styles.label} variants={staggerChild}>
              {t('labels.passwordConfirmOptional')}
            </motion.label>
            <div className={styles.inputWrapper}>
              <div className={styles.inputIcon}>
                <LockIcon className={styles.iconItem} size={20}/>
              </div>
              <motion.input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder={t('placeholders.passwordConfirm')}
                className={`${styles.input} ${
                  errors.confirmPassword ? styles.inputError : ''
                }`}
                whileFocus="focus"
              />
              <motion.button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={styles.eyeButton}
                whileHover={{ rotate: 180, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ rotate: { duration: 0.4 } }}
              >
                {showConfirmPassword ? <EyeOff className={styles.iconItem} size={20} /> : <Eye className={styles.iconItem} size={20} />}
              </motion.button>
            </div>
            {errors.confirmPassword && (
              <motion.span className={styles.error} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>{errors.confirmPassword}</motion.span>
            )}
          </motion.div>

          <motion.button
            type="submit"
            className={`${styles.button} ${styles.buttonPrimary}`}
            disabled={isLoading}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {isLoading ? t('buttons.creating') : t('buttons.createAccount')}
          </motion.button>
        </motion.form>
      </motion.div>
    ),
    [
      password,
      confirmPassword,
      showPassword,
      showConfirmPassword,
      errors,
      isLoading,
      contactValue,
      handleEmailRegister,
      handleBack,
      t,
    ],
  )

  const renderEmailLogin = React.useMemo(
    () => (
      <motion.div
        className={styles.formContainer}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.button onClick={handleBack} className={styles.backButton} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <ArrowLeft className={styles.iconItem} size={20} />
        </motion.button>

        <motion.div className={styles.header} variants={staggerChild}>
          <motion.h1 className={styles.title} variants={staggerChild}>{t('emailLogin.title')}</motion.h1>
          <motion.p className={styles.subtitle} variants={staggerChild}>
            {t('emailLogin.subtitle', { contactValue })}
          </motion.p>
        </motion.div>

        <motion.form onSubmit={handleEmailLogin} className={styles.form} variants={staggerChild}>
          <motion.div className={styles.inputGroup} variants={staggerChild}>
            <motion.label className={styles.label} variants={staggerChild}>{t('labels.password')}</motion.label>
            <div className={styles.inputWrapper}>
              <div className={styles.inputIcon}>
                <LockIcon className={styles.iconItem} size={20}/>
              </div>
              <motion.input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t('placeholders.passwordLogin')}
                className={`${styles.input} ${
                  errors.password ? styles.inputError : ''
                }`}
                whileFocus="focus"
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eyeButton}
                whileHover={{ rotate: 180, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ rotate: { duration: 0.4 } }}
              >
                {showPassword ? <EyeOff className={styles.iconItem} size={20} /> : <Eye className={styles.iconItem} size={20} />}
              </motion.button>
            </div>
            {errors.password && <motion.span className={styles.error} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>{errors.password}</motion.span>}
          </motion.div>

          <motion.a href="#" className={styles.forgotPassword} initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ scale: 1.05, x: 5 }}>
            {t('links.forgotPassword')}
          </motion.a>

          <motion.button
            type="submit"
            className={`${styles.button} ${styles.buttonPrimary}`}
            disabled={isLoading}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {isLoading ? t('buttons.loggingIn') : t('buttons.login')}
          </motion.button>
        </motion.form>
      </motion.div>
    ),
    [
      password,
      showPassword,
      errors,
      isLoading,
      contactValue,
      handleEmailLogin,
      handleBack,
      t,
    ],
  )

  const renderPhoneVerify = React.useMemo(
    () => (
      <motion.div
        className={styles.formContainer}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.button onClick={handleBack} className={styles.backButton} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <ArrowLeft className={styles.iconItem} size={20} />
        </motion.button>

        <motion.div className={styles.header} variants={staggerChild}>
          <motion.h1 className={styles.title} variants={staggerChild}>{t('phoneVerify.title')}</motion.h1>
          <motion.p className={styles.subtitle} variants={staggerChild}>
            {t('phoneVerify.subtitlePrefix')}
            <br />
            <motion.strong initial={{ opacity: 0 }} animate={{ opacity: 1, scale: [1, 1.05, 1] }} transition={{ delay: 0.5, duration: 0.5 }}>{contactValue}</motion.strong>
          </motion.p>
        </motion.div>

        <motion.form onSubmit={handlePhoneVerify} className={styles.form} variants={staggerChild}>
          <motion.div className={styles.inputGroup} variants={staggerChild}>
            <motion.label className={styles.label} variants={staggerChild}>{t('labels.smsCode')}</motion.label>
            <motion.input
              type="text"
              value={smsCode}
              onChange={e => setSmsCode(e.target.value.replace(/\D/g, ''))}
              placeholder={t('placeholders.smsCode')}
              maxLength={6}
              className={`${styles.input} ${styles.codeInput} ${
                errors.smsCode ? styles.inputError : ''
              }`}
              whileFocus="focus"
              whileHover={{ scale: 1.01 }}
              animate={{ scale: smsCode.length > 0 ? 1.05 : 1 }}
              transition={{ scale: { duration: 0.2 } }}
            />
            {errors.smsCode && <motion.span className={styles.error} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>{errors.smsCode}</motion.span>}
          </motion.div>

          <motion.button
            type="submit"
            className={`${styles.button} ${styles.buttonPrimary}`}
            disabled={isLoading}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {isLoading ? t('buttons.verifying') : t('buttons.verify')}
          </motion.button>

          <motion.button
            type="button"
            className={styles.resendButton}
            onClick={() => console.log('Resend SMS code')}
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('buttons.resendCode')}
          </motion.button>
        </motion.form>
      </motion.div>
    ),
    [smsCode, errors, isLoading, contactValue, handlePhoneVerify, handleBack, t],
  )

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.illustration}
      >
        <motion.div className={styles.illustrationContent} initial={{ y: 50 }} animate={{ y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <motion.h2 className={styles.illustrationTitle} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {t('illustration.title')}
          </motion.h2>
          <motion.p className={styles.illustrationText} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            {t('illustration.textLine1')}
            <br />
            {t('illustration.textLine2')}
          </motion.p>
        </motion.div>
      </motion.div>

      <div className={styles.content}>
        <AnimatePresence mode="wait">
          {step === 'initial' && (
            <motion.div
              key="initial"
              variants={stepVariants[direction]}
              initial="initial"
              animate="animate"
              exit="exit"
              className={styles.formWrapper}
            >
              {renderInitialStep}
            </motion.div>
          )}
          {step === 'email-register' && (
            <motion.div
              key="email-register"
              variants={stepVariants[direction]}
              initial="initial"
              animate="animate"
              exit="exit"
              className={styles.formWrapper}
            >
              {renderEmailRegister}
            </motion.div>
          )}
          {step === 'email-login' && (
            <motion.div
              key="email-login"
              variants={stepVariants[direction]}
              initial="initial"
              animate="animate"
              exit="exit"
              className={styles.formWrapper}
            >
              {renderEmailLogin}
            </motion.div>
          )}
          {step === 'phone-verify' && (
            <motion.div
              key="phone-verify"
              variants={stepVariants[direction]}
              initial="initial"
              animate="animate"
              exit="exit"
              className={styles.formWrapper}
            >
              {renderPhoneVerify}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
