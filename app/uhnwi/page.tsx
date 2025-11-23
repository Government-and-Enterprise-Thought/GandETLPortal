'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import styles from './page.module.css'

interface UHNWI {
  _id: string
  name: string
  email?: string
  netWorth?: number
  status?: string
  createdAt?: string
  updatedAt?: string
}

export default function UHNWIPage() {
  const [uhnwis, setUhnwis] = useState<UHNWI[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUHNWIs()
  }, [])

  const fetchUHNWIs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/uhnwi')
      if (!response.ok) {
        throw new Error('Failed to fetch UHNWI records')
      }
      const data = await response.json()
      setUhnwis(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching UHNWIs:', err)
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
            <h2 className={styles.pageTitle}>Ultra High Net Worth Individuals</h2>
            <p className={styles.pageSubtitle}>
              Manage and view UHNWI records in your system
            </p>
          </div>
          <Link href="/uhnwi/add" className={styles.addButton}>
            <span className={styles.addIcon}>+</span>
            Add New UHNWI
          </Link>
        </div>

        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading UHNWI records...</p>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <p>⚠️ {error}</p>
            <button onClick={fetchUHNWIs} className={styles.retryButton}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {uhnwis.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>👤</div>
                <h3>No UHNWI Records Found</h3>
                <p>Get started by adding your first Ultra High Net Worth Individual</p>
                <Link href="/uhnwi/add" className={styles.addButton}>
                  <span className={styles.addIcon}>+</span>
                  Add New UHNWI
                </Link>
              </div>
            ) : (
              <>
                <div className={styles.stats}>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>{uhnwis.length}</div>
                    <div className={styles.statLabel}>Total Records</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>
                      {uhnwis.filter((u) => u.status === 'active').length}
                    </div>
                    <div className={styles.statLabel}>Active</div>
                  </div>
                </div>

                <div className={styles.grid}>
                  {uhnwis.map((uhnwi) => (
                    <div key={uhnwi._id} className={styles.card}>
                      <div className={styles.cardHeader}>
                        <div className={styles.cardIcon}>💼</div>
                        <div className={styles.cardTitleSection}>
                          <h3 className={styles.cardTitle}>{uhnwi.name || 'Unnamed'}</h3>
                          {uhnwi.status && (
                            <span
                              className={`${styles.statusBadge} ${
                                uhnwi.status === 'active'
                                  ? styles.statusActive
                                  : styles.statusInactive
                              }`}
                            >
                              {uhnwi.status}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={styles.cardContent}>
                        {uhnwi.email && (
                          <div className={styles.cardField}>
                            <span className={styles.fieldLabel}>Email:</span>
                            <span className={styles.fieldValue}>{uhnwi.email}</span>
                          </div>
                        )}
                        {uhnwi.netWorth && (
                          <div className={styles.cardField}>
                            <span className={styles.fieldLabel}>Net Worth:</span>
                            <span className={styles.fieldValue}>
                              {formatCurrency(uhnwi.netWorth)}
                            </span>
                          </div>
                        )}
                        {uhnwi.createdAt && (
                          <div className={styles.cardField}>
                            <span className={styles.fieldLabel}>Created:</span>
                            <span className={styles.fieldValue}>
                              {formatDate(uhnwi.createdAt)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className={styles.cardActions}>
                        <Link
                          href={`/uhnwi/${uhnwi._id}`}
                          className={styles.viewButton}
                        >
                          View Details
                        </Link>
                        <Link
                          href={`/uhnwi/edit/${uhnwi._id}`}
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

