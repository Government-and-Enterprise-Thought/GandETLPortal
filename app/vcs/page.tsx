'use client'

import { useState, useEffect } from 'react'
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
  createdAt?: string
  updatedAt?: string
}

export default function VentureCapitalPage() {
  const [vcs, setVcs] = useState<VentureCapital[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchVentureCapitals()
  }, [])

  const fetchVentureCapitals = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/venture-capital')
      if (!response.ok) {
        throw new Error('Failed to fetch Venture Capital records')
      }
      const data = await response.json()
      setVcs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching Venture Capitals:', err)
    } finally {
      setLoading(false)
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
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageTitle}>Venture Capital Companies</h2>
            <p className={styles.pageSubtitle}>
              Manage and view Venture Capital company records in your system
            </p>
          </div>
          <Link href="/vcs/add" className={styles.addButton}>
            <span className={styles.addIcon}>+</span>
            Add New Company
          </Link>
        </div>

        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading Venture Capital records...</p>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <p>⚠️ {error}</p>
            <button onClick={fetchVentureCapitals} className={styles.retryButton}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {vcs.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🏢</div>
                <h3>No Venture Capital Companies Found</h3>
                <p>Get started by adding your first Venture Capital company</p>
                <Link href="/vcs/add" className={styles.addButton}>
                  <span className={styles.addIcon}>+</span>
                  Add New Company
                </Link>
              </div>
            ) : (
              <>
                <div className={styles.stats}>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>{vcs.length}</div>
                    <div className={styles.statLabel}>Total Companies</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>
                      {vcs.filter((vc) => vc.status === 'active').length}
                    </div>
                    <div className={styles.statLabel}>Active</div>
                  </div>
                </div>

                <div className={styles.grid}>
                  {vcs.map((vc) => (
                    <div key={vc._id} className={styles.card}>
                      <div className={styles.cardHeader}>
                        <div className={styles.cardIcon}>🏢</div>
                        <div className={styles.cardTitleSection}>
                          <h3 className={styles.cardTitle}>{vc.companyName || 'Unnamed Company'}</h3>
                          {vc.status && (
                            <span
                              className={`${styles.statusBadge} ${
                                vc.status === 'active'
                                  ? styles.statusActive
                                  : styles.statusInactive
                              }`}
                            >
                              {vc.status}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={styles.cardContent}>
                        {vc.website && (
                          <div className={styles.cardField}>
                            <span className={styles.fieldLabel}>Website:</span>
                            <span className={styles.fieldValue}>
                              <a href={vc.website} target="_blank" rel="noopener noreferrer" className={styles.link}>
                                {vc.website}
                              </a>
                            </span>
                          </div>
                        )}
                        {vc.email && (
                          <div className={styles.cardField}>
                            <span className={styles.fieldLabel}>Email:</span>
                            <span className={styles.fieldValue}>{vc.email}</span>
                          </div>
                        )}
                        {vc.fundSize && (
                          <div className={styles.cardField}>
                            <span className={styles.fieldLabel}>Fund Size:</span>
                            <span className={styles.fieldValue}>
                              {formatCurrency(vc.fundSize)}
                            </span>
                          </div>
                        )}
                        {vc.industryFocus && vc.industryFocus.length > 0 && (
                          <div className={styles.cardField}>
                            <span className={styles.fieldLabel}>Industry Focus:</span>
                            <span className={styles.fieldValue}>
                              {vc.industryFocus.join(', ')}
                            </span>
                          </div>
                        )}
                        {vc.createdAt && (
                          <div className={styles.cardField}>
                            <span className={styles.fieldLabel}>Created:</span>
                            <span className={styles.fieldValue}>
                              {formatDate(vc.createdAt)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className={styles.cardActions}>
                        <Link
                          href={`/vcs/${vc._id}`}
                          className={styles.viewButton}
                        >
                          View Details
                        </Link>
                        <Link
                          href={`/vcs/edit/${vc._id}`}
                          className={styles.editButton}
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
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

