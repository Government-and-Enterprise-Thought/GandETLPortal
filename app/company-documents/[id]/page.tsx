'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
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

export default function CompanyDocumentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [document, setDocument] = useState<CompanyDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchDocument()
  }, [id])

  const fetchDocument = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/company-documents/${id}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Company document not found')
        }
        throw new Error('Failed to fetch company document')
      }
      const data = await response.json()
      setDocument(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this company document? This action cannot be undone.')) {
      return
    }

    try {
      setDeleting(true)
      const response = await fetch(`/api/company-documents/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete company document')
      }

      router.push('/company-documents')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setDeleting(false)
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
          <p>Loading document...</p>
        </div>
      </div>
    )
  }

  if (error || !document) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <div className={styles.error}>
            <p>⚠️ {error || 'Company document not found'}</p>
            <Link href="/company-documents" className={styles.backButton}>
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
            <h2 className={styles.pageTitle}>{document.title}</h2>
            <p className={styles.pageSubtitle}>Company Document Details</p>
          </div>
          <div className={styles.headerActions}>
            <Link href="/company-documents" className={styles.backButton}>
              ← Back to List
            </Link>
            <Link href={`/company-documents/edit/${id}`} className={styles.editButton}>
              Edit
            </Link>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>📄</div>
              <div>
                <h3 className={styles.cardTitle}>Document Information</h3>
              </div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Title</span>
                <span className={styles.fieldValue}>{document.title}</span>
              </div>
              {document.documentType && (
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Document Type</span>
                  <span className={styles.fieldValue}>{document.documentType}</span>
                </div>
              )}
              {document.category && (
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Category</span>
                  <span className={styles.fieldValue}>{document.category}</span>
                </div>
              )}
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Status</span>
                <span
                  className={`${styles.statusBadge} ${
                    document.status === 'active'
                      ? styles.statusActive
                      : document.status === 'archived'
                      ? styles.statusArchived
                      : styles.statusDraft
                  }`}
                >
                  {document.status || 'active'}
                </span>
              </div>
            </div>
          </div>

          {document.fileUrl || document.fileName || document.fileSize ? (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>📎</div>
                <div>
                  <h3 className={styles.cardTitle}>File Information</h3>
                </div>
              </div>
              <div className={styles.cardContent}>
                {document.fileName && (
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>File Name</span>
                    <span className={styles.fieldValue}>{document.fileName}</span>
                  </div>
                )}
                {document.fileSize && (
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>File Size</span>
                    <span className={styles.fieldValue}>{formatFileSize(document.fileSize)}</span>
                  </div>
                )}
                {document.fileUrl && (
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>File URL</span>
                    <span className={styles.fieldValue}>
                      <a href={document.fileUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        {document.fileUrl}
                      </a>
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {document.description && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>📝</div>
                <div>
                  <h3 className={styles.cardTitle}>Description</h3>
                </div>
              </div>
              <div className={styles.cardContent}>
                <p className={styles.description}>{document.description}</p>
              </div>
            </div>
          )}

          {document.tags && document.tags.length > 0 && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>🏷️</div>
                <div>
                  <h3 className={styles.cardTitle}>Tags</h3>
                </div>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.tags}>
                  {document.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {document.relatedTo && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>🔗</div>
                <div>
                  <h3 className={styles.cardTitle}>Related To</h3>
                </div>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Related Entity</span>
                  <span className={styles.fieldValue}>{document.relatedTo}</span>
                </div>
              </div>
            </div>
          )}

          {document.notes && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>🗒️</div>
                <div>
                  <h3 className={styles.cardTitle}>Notes</h3>
                </div>
              </div>
              <div className={styles.cardContent}>
                <p className={styles.notes}>{document.notes}</p>
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
                <span className={styles.fieldValue}>{formatDate(document.createdAt)}</span>
              </div>
              {document.updatedAt && (
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Last Updated</span>
                  <span className={styles.fieldValue}>{formatDate(document.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.actionsCard}>
            <div className={styles.actions}>
              <Link href={`/company-documents/edit/${id}`} className={styles.primaryButton}>
                Edit Document
              </Link>
              <button
                onClick={handleDelete}
                className={styles.deleteButton}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Document'}
              </button>
            </div>
          </div>
        </div>
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





