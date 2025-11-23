'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import styles from './page.module.css'

interface DealRoom {
  _id: string
  name: string
  description?: string
  status?: string
  dealType?: string
  dealValue?: number
  currency?: string
  participants?: string[]
  startDate?: string
  endDate?: string
  location?: string
  createdAt?: string
  updatedAt?: string
}

export default function DealRoomsPage() {
  const [dealRooms, setDealRooms] = useState<DealRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDealRooms()
  }, [])

  const fetchDealRooms = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/deal-rooms')
      if (!response.ok) {
        throw new Error('Failed to fetch deal rooms')
      }
      const data = await response.json()
      setDealRooms(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching deal rooms:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount?: number, currency?: string) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
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

  const formatDealType = (dealType?: string) => {
    if (!dealType) return ''
    return dealType
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageTitle}>Deal Rooms</h2>
            <p className={styles.pageSubtitle}>
              Manage and view deal rooms
            </p>
          </div>
          <Link href="/deal-rooms/add" className={styles.addButton}>
            <span className={styles.addIcon}>+</span>
            Create Deal Room
          </Link>
        </div>

        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading deal rooms...</p>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <p>⚠️ {error}</p>
            <button onClick={fetchDealRooms} className={styles.retryButton}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {dealRooms.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🏢</div>
                <h3>No Deal Rooms Found</h3>
                <p>Get started by creating your first deal room</p>
                <Link href="/deal-rooms/add" className={styles.addButton}>
                  <span className={styles.addIcon}>+</span>
                  Create Deal Room
                </Link>
              </div>
            ) : (
              <>
                <div className={styles.stats}>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>{dealRooms.length}</div>
                    <div className={styles.statLabel}>Total Deal Rooms</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>
                      {dealRooms.filter((room) => room.status === 'active').length}
                    </div>
                    <div className={styles.statLabel}>Active</div>
                  </div>
                </div>

                <div className={styles.grid}>
                  {dealRooms.map((room) => (
                    <div key={room._id} className={styles.card}>
                      <div className={styles.cardHeader}>
                        <div className={styles.cardIcon}>🏢</div>
                        <div className={styles.cardTitleSection}>
                          <h3 className={styles.cardTitle}>{room.name || 'Unnamed Deal Room'}</h3>
                          <div className={styles.badgesContainer}>
                            {room.dealType && (
                              <span className={styles.dealTypeBadge}>
                                {formatDealType(room.dealType)}
                              </span>
                            )}
                            {room.status && (
                              <span
                                className={`${styles.statusBadge} ${
                                  room.status === 'active'
                                    ? styles.statusActive
                                    : room.status === 'closed'
                                    ? styles.statusClosed
                                    : room.status === 'archived'
                                    ? styles.statusArchived
                                    : styles.statusPending
                                }`}
                              >
                                {room.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={styles.cardContent}>
                        {room.dealValue && (
                          <div className={styles.cardField}>
                            <span className={styles.fieldLabel}>Deal Value:</span>
                            <span className={styles.fieldValue}>{formatCurrency(room.dealValue, room.currency)}</span>
                          </div>
                        )}
                        {room.participants && room.participants.length > 0 && (
                          <div className={styles.cardField}>
                            <span className={styles.fieldLabel}>Participants:</span>
                            <span className={styles.fieldValue}>{room.participants.length}</span>
                          </div>
                        )}
                        {room.startDate && (
                          <div className={styles.cardField}>
                            <span className={styles.fieldLabel}>Start Date:</span>
                            <span className={styles.fieldValue}>{formatDate(room.startDate)}</span>
                          </div>
                        )}
                        {room.createdAt && (
                          <div className={styles.cardField}>
                            <span className={styles.fieldLabel}>Created:</span>
                            <span className={styles.fieldValue}>{formatDate(room.createdAt)}</span>
                          </div>
                        )}
                      </div>

                      <div className={styles.cardActions}>
                        <Link
                          href={`/deal-rooms/${room._id}`}
                          className={styles.viewButton}
                        >
                          View Details
                        </Link>
                        <Link
                          href={`/deal-rooms/edit/${room._id}`}
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
        <p>&copy; 2024 GETL. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  )
}

