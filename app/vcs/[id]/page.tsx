'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import styles from './page.module.css'

interface VentureCapital {
  _id: string
  companyName: string
  website?: string
  email?: string
  fundSize?: number
  status?: string
  description?: string
  industryFocus?: string[]
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export default function VentureCapitalDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [vc, setVc] = useState<VentureCapital | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchVentureCapital()
  }, [id])

  const fetchVentureCapital = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/venture-capital/${id}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Venture Capital company not found')
        }
        throw new Error('Failed to fetch Venture Capital company')
      }
      const data = await response.json()
      setVc(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this Venture Capital company? This action cannot be undone.')) {
      return
    }

    try {
      setDeleting(true)
      const response = await fetch(`/api/venture-capital/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete Venture Capital company')
      }

      router.push('/vcs')
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
          <p>Loading Venture Capital company...</p>
        </div>
      </div>
    )
  }

  if (error || !vc) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <div className={styles.error}>
            <p>⚠️ {error || 'Venture Capital company not found'}</p>
            <Link href="/vcs" className={styles.backButton}>
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
            <h2 className={styles.pageTitle}>{vc.companyName}</h2>
            <p className={styles.pageSubtitle}>Venture Capital Company Details</p>
          </div>
          <div className={styles.headerActions}>
            <Link href="/vcs" className={styles.backButton}>
              ← Back to List
            </Link>
            <Link href={`/vcs/edit/${id}`} className={styles.editButton}>
              Edit
            </Link>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>🏢</div>
              <div>
                <h3 className={styles.cardTitle}>Company Information</h3>
              </div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Company Name</span>
                <span className={styles.fieldValue}>{vc.companyName}</span>
              </div>
              {vc.website && (
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Website</span>
                  <span className={styles.fieldValue}>
                    <a href={vc.website} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      {vc.website}
                    </a>
                  </span>
                </div>
              )}
              {vc.email && (
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Email</span>
                  <span className={styles.fieldValue}>
                    <a href={`mailto:${vc.email}`} className={styles.emailLink}>
                      {vc.email}
                    </a>
                  </span>
                </div>
              )}
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Status</span>
                <span
                  className={`${styles.statusBadge} ${
                    vc.status === 'active'
                      ? styles.statusActive
                      : vc.status === 'pending'
                      ? styles.statusPending
                      : styles.statusInactive
                  }`}
                >
                  {vc.status || 'active'}
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
                <span className={styles.fieldLabel}>Fund Size</span>
                <span className={styles.fieldValueLarge}>
                  {formatCurrency(vc.fundSize)}
                </span>
              </div>
            </div>
          </div>

          {vc.description && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>📄</div>
                <div>
                  <h3 className={styles.cardTitle}>Description</h3>
                </div>
              </div>
              <div className={styles.cardContent}>
                <p className={styles.description}>{vc.description}</p>
              </div>
            </div>
          )}

          {vc.industryFocus && vc.industryFocus.length > 0 && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>🎯</div>
                <div>
                  <h3 className={styles.cardTitle}>Industry Focus</h3>
                </div>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.tags}>
                  {vc.industryFocus.map((industry, index) => (
                    <span key={index} className={styles.tag}>
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {vc.notes && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>📝</div>
                <div>
                  <h3 className={styles.cardTitle}>Notes</h3>
                </div>
              </div>
              <div className={styles.cardContent}>
                <p className={styles.notes}>{vc.notes}</p>
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
                <span className={styles.fieldValue}>{formatDate(vc.createdAt)}</span>
              </div>
              {vc.updatedAt && (
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Last Updated</span>
                  <span className={styles.fieldValue}>{formatDate(vc.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.actionsCard}>
            <div className={styles.actions}>
              <Link href={`/vcs/edit/${id}`} className={styles.primaryButton}>
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

