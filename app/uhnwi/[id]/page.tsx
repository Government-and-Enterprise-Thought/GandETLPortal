'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import styles from './page.module.css'

interface UHNWI {
  _id: string
  name: string
  email?: string
  netWorth?: number
  status?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export default function UHNWIDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [uhnwi, setUhnwi] = useState<UHNWI | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchUHNWI()
  }, [id])

  const fetchUHNWI = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/uhnwi/${id}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('UHNWI not found')
        }
        throw new Error('Failed to fetch UHNWI')
      }
      const data = await response.json()
      setUhnwi(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this UHNWI record? This action cannot be undone.')) {
      return
    }

    try {
      setDeleting(true)
      const response = await fetch(`/api/uhnwi/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete UHNWI')
      }

      router.push('/uhnwi')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setDeleting(false)
    }
  }

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading UHNWI record...</p>
        </div>
      </div>
    )
  }

  if (error || !uhnwi) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <div className={styles.error}>
            <p>⚠️ {error || 'UHNWI not found'}</p>
            <Link href="/uhnwi" className={styles.backButton}>
              ← Back to List
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageTitle}>{uhnwi.name}</h2>
            <p className={styles.pageSubtitle}>Ultra High Net Worth Individual Details</p>
          </div>
          <div className={styles.headerActions}>
            <Link href="/uhnwi" className={styles.backButton}>
              ← Back to List
            </Link>
            <Link href={`/uhnwi/edit/${id}`} className={styles.editButton}>
              Edit
            </Link>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>💼</div>
              <div>
                <h3 className={styles.cardTitle}>Basic Information</h3>
              </div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Name</span>
                <span className={styles.fieldValue}>{uhnwi.name}</span>
              </div>
              {uhnwi.email && (
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Email</span>
                  <span className={styles.fieldValue}>
                    <a href={`mailto:${uhnwi.email}`} className={styles.emailLink}>
                      {uhnwi.email}
                    </a>
                  </span>
                </div>
              )}
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Status</span>
                <span
                  className={`${styles.statusBadge} ${
                    uhnwi.status === 'active'
                      ? styles.statusActive
                      : uhnwi.status === 'pending'
                      ? styles.statusPending
                      : styles.statusInactive
                  }`}
                >
                  {uhnwi.status || 'active'}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>💰</div>
              <div>
                <h3 className={styles.cardTitle}>Financial Information</h3>
              </div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Net Worth</span>
                <span className={styles.fieldValueLarge}>
                  {formatCurrency(uhnwi.netWorth)}
                </span>
              </div>
            </div>
          </div>

          {uhnwi.notes && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>📝</div>
                <div>
                  <h3 className={styles.cardTitle}>Notes</h3>
                </div>
              </div>
              <div className={styles.cardContent}>
                <p className={styles.notes}>{uhnwi.notes}</p>
              </div>
            </div>
          )}

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>📅</div>
              <div>
                <h3 className={styles.cardTitle}>Timestamps</h3>
              </div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Created</span>
                <span className={styles.fieldValue}>{formatDate(uhnwi.createdAt)}</span>
              </div>
              {uhnwi.updatedAt && (
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Last Updated</span>
                  <span className={styles.fieldValue}>{formatDate(uhnwi.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.actionsCard}>
            <div className={styles.actions}>
              <Link href={`/uhnwi/edit/${id}`} className={styles.primaryButton}>
                Edit Record
              </Link>
              <button
                onClick={handleDelete}
                className={styles.deleteButton}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Record'}
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 GandETL. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  )
}

