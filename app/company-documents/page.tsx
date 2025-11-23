'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import styles from './page.module.css'

interface CompanyDocument {
  _id: string
  title: string
  documentType?: string
  description?: string
  fileUrl?: string
  fileName?: string
  fileSize?: number
  status?: string
  category?: string
  tags?: string[]
  relatedTo?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export default function CompanyDocumentsPage() {
  const [documents, setDocuments] = useState<CompanyDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/company-documents')
      if (!response.ok) {
        throw new Error('Failed to fetch company documents')
      }
      const data = await response.json()
      setDocuments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching documents:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
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
            <h2 className={styles.pageTitle}>Company Documents</h2>
            <p className={styles.pageSubtitle}>
              Manage and view company documents
            </p>
          </div>
          <Link href="/company-documents/add" className={styles.addButton}>
            <span className={styles.addIcon}>+</span>
            Add New Document
          </Link>
        </div>

        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading documents...</p>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <p>⚠️ {error}</p>
            <button onClick={fetchDocuments} className={styles.retryButton}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {documents.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📄</div>
                <h3>No Documents Found</h3>
                <p>Get started by adding your first company document</p>
                <Link href="/company-documents/add" className={styles.addButton}>
                  <span className={styles.addIcon}>+</span>
                  Add New Document
                </Link>
              </div>
            ) : (
              <>
                <div className={styles.stats}>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>{documents.length}</div>
                    <div className={styles.statLabel}>Total Documents</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statValue}>
                      {documents.filter((doc) => doc.status === 'active').length}
                    </div>
                    <div className={styles.statLabel}>Active</div>
                  </div>
                </div>

                <div className={styles.grid}>
                  {documents.map((doc) => (
                    <div key={doc._id} className={styles.card}>
                      <div className={styles.cardHeader}>
                        <div className={styles.cardIcon}>📄</div>
                        <div className={styles.cardTitleSection}>
                          <h3 className={styles.cardTitle}>{doc.title || 'Untitled Document'}</h3>
                          {doc.status && (
                            <span
                              className={`${styles.statusBadge} ${
                                doc.status === 'active'
                                  ? styles.statusActive
                                  : doc.status === 'archived'
                                  ? styles.statusArchived
                                  : styles.statusDraft
                              }`}
                            >
                              {doc.status}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={styles.cardContent}>
                        {doc.documentType && (
                          <div className={styles.cardField}>
                            <span className={styles.fieldLabel}>Type:</span>
                            <span className={styles.fieldValue}>{doc.documentType}</span>
                          </div>
                        )}
                        {doc.category && (
                          <div className={styles.cardField}>
                            <span className={styles.fieldLabel}>Category:</span>
                            <span className={styles.fieldValue}>{doc.category}</span>
                          </div>
                        )}
                        {doc.fileName && (
                          <div className={styles.cardField}>
                            <span className={styles.fieldLabel}>File:</span>
                            <span className={styles.fieldValue}>{doc.fileName}</span>
                          </div>
                        )}
                        {doc.fileSize && (
                          <div className={styles.cardField}>
                            <span className={styles.fieldLabel}>Size:</span>
                            <span className={styles.fieldValue}>{formatFileSize(doc.fileSize)}</span>
                          </div>
                        )}
                        {doc.tags && doc.tags.length > 0 && (
                          <div className={styles.cardField}>
                            <span className={styles.fieldLabel}>Tags:</span>
                            <span className={styles.fieldValue}>{doc.tags.join(', ')}</span>
                          </div>
                        )}
                        {doc.createdAt && (
                          <div className={styles.cardField}>
                            <span className={styles.fieldLabel}>Created:</span>
                            <span className={styles.fieldValue}>{formatDate(doc.createdAt)}</span>
                          </div>
                        )}
                      </div>

                      <div className={styles.cardActions}>
                        <Link
                          href={`/company-documents/${doc._id}`}
                          className={styles.viewButton}
                        >
                          View Details
                        </Link>
                        <Link
                          href={`/company-documents/edit/${doc._id}`}
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

