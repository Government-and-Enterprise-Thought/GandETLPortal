'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
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

interface DealRoomDocument {
  _id: string
  title: string
  fileName?: string
  fileUrl?: string
  fileSize?: number
  fileType?: string
  description?: string
  folderPath?: string
  parentFolderId?: string | null
  isFolder: boolean
  documentType?: string
  status?: string
  tags?: string[]
  createdAt?: string
  updatedAt?: string
}

export default function DealRoomDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [activeTab, setActiveTab] = useState<'info' | 'documents'>('info')
  const [dealRoom, setDealRoom] = useState<DealRoom | null>(null)
  const [documents, setDocuments] = useState<DealRoomDocument[]>([])
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [folderPath, setFolderPath] = useState<Array<{ id: string | null; name: string }>>([{ id: null, name: 'Root' }])
  const [loading, setLoading] = useState(true)
  const [documentsLoading, setDocumentsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAddDocument, setShowAddDocument] = useState(false)
  const [showAddFolder, setShowAddFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [documentTitle, setDocumentTitle] = useState('')
  const [documentDescription, setDocumentDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (id) {
      fetchDealRoom()
      if (activeTab === 'documents') {
        fetchDocuments()
      }
    }
  }, [id, activeTab, currentFolderId])

  const fetchDealRoom = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/deal-rooms/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch deal room')
      }
      const data = await response.json()
      setDealRoom(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const fetchDocuments = async () => {
    try {
      setDocumentsLoading(true)
      const url = currentFolderId
        ? `/api/deal-rooms/${id}/documents?parentFolderId=${currentFolderId}`
        : `/api/deal-rooms/${id}/documents?parentFolderId=root`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch documents')
      }
      const data = await response.json()
      setDocuments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setDocumentsLoading(false)
    }
  }

  const handleFolderClick = (folder: DealRoomDocument) => {
    if (expandedFolders.has(folder._id)) {
      setExpandedFolders((prev) => {
        const next = new Set(prev)
        next.delete(folder._id)
        return next
      })
    } else {
      setExpandedFolders((prev) => new Set([...prev, folder._id]))
    }
  }

  const handleFolderNavigate = (folder: DealRoomDocument) => {
    setCurrentFolderId(folder._id)
    setFolderPath((prev) => [...prev, { id: folder._id, name: folder.title }])
    setExpandedFolders((prev) => new Set([...prev, folder._id]))
  }

  const handleBreadcrumbClick = (index: number) => {
    const newPath = folderPath.slice(0, index + 1)
    setFolderPath(newPath)
    setCurrentFolderId(newPath[newPath.length - 1].id)
  }

  const handleAddFolder = async () => {
    if (!newFolderName.trim()) return

    try {
      const response = await fetch(`/api/deal-rooms/${id}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newFolderName,
          isFolder: true,
          parentFolderId: currentFolderId,
          folderPath: currentFolderId
            ? `${folderPath.map((p) => p.name).join('/')}/${newFolderName}`
            : `/${newFolderName}`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create folder')
      }

      setNewFolderName('')
      setShowAddFolder(false)
      fetchDocuments()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (!documentTitle) {
        setDocumentTitle(file.name)
      }
    }
  }

  const handleAddDocument = async () => {
    if (!selectedFile || !documentTitle.trim()) {
      setError('Please select a file and provide a title')
      return
    }

    try {
      setUploading(true)
      setError(null)

      // For now, we'll create a document record with file metadata
      // In a production app, you'd upload the file to cloud storage (S3, etc.) first
      const fileSize = selectedFile.size
      const fileType = selectedFile.type || selectedFile.name.split('.').pop() || 'unknown'
      
      // Create a data URL for demo purposes (in production, use cloud storage URL)
      const reader = new FileReader()
      reader.onloadend = async () => {
        const fileUrl = reader.result as string

        const response = await fetch(`/api/deal-rooms/${id}/documents`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: documentTitle,
            fileName: selectedFile.name,
            fileUrl: fileUrl, // In production, this would be a cloud storage URL
            fileSize: fileSize,
            fileType: fileType,
            description: documentDescription,
            isFolder: false,
            parentFolderId: currentFolderId,
            folderPath: currentFolderId
              ? `${folderPath.map((p) => p.name).join('/')}`
              : '/',
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to add document')
        }

        setDocumentTitle('')
        setDocumentDescription('')
        setSelectedFile(null)
        setShowAddDocument(false)
        fetchDocuments()
        setUploading(false)
      }
      reader.readAsDataURL(selectedFile)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setUploading(false)
    }
  }

  const handleDeleteDocument = async (docId: string, isFolder: boolean) => {
    if (!confirm(`Are you sure you want to delete this ${isFolder ? 'folder' : 'document'}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/deal-rooms/${id}/documents/${docId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete')
      }

      fetchDocuments()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
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

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading deal room...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !dealRoom) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <div className={styles.error}>
            <p>⚠️ {error || 'Deal room not found'}</p>
            <Link href="/deal-rooms" className={styles.backButton}>
              ← Back to Deal Rooms
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
            <Link href="/deal-rooms" className={styles.backLink}>
              ← Back to Deal Rooms
            </Link>
            <h2 className={styles.pageTitle}>{dealRoom.name}</h2>
            <p className={styles.pageSubtitle}>Deal Room Details</p>
          </div>
          <Link href={`/deal-rooms/edit/${id}`} className={styles.editButton}>
            Edit Deal Room
          </Link>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'info' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Deal Information
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'documents' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            Documents
          </button>
        </div>

        {activeTab === 'info' && (
          <div className={styles.infoSection}>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <h3 className={styles.infoCardTitle}>Basic Information</h3>
                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>Status:</span>
                  <span className={`${styles.statusBadge} ${styles[`status${dealRoom.status?.charAt(0).toUpperCase() + dealRoom.status?.slice(1) || 'Active'}`]}`}>
                    {dealRoom.status || 'Active'}
                  </span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>Deal Type:</span>
                  <span className={styles.infoValue}>{dealRoom.dealType || 'N/A'}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>Deal Value:</span>
                  <span className={styles.infoValue}>{formatCurrency(dealRoom.dealValue, dealRoom.currency)}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>Location:</span>
                  <span className={styles.infoValue}>{dealRoom.location || 'N/A'}</span>
                </div>
              </div>

              <div className={styles.infoCard}>
                <h3 className={styles.infoCardTitle}>Timeline</h3>
                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>Start Date:</span>
                  <span className={styles.infoValue}>{formatDate(dealRoom.startDate)}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>End Date:</span>
                  <span className={styles.infoValue}>{formatDate(dealRoom.endDate)}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>Created:</span>
                  <span className={styles.infoValue}>{formatDate(dealRoom.createdAt)}</span>
                </div>
                <div className={styles.infoField}>
                  <span className={styles.infoLabel}>Last Updated:</span>
                  <span className={styles.infoValue}>{formatDate(dealRoom.updatedAt)}</span>
                </div>
              </div>

              <div className={styles.infoCard}>
                <h3 className={styles.infoCardTitle}>Participants</h3>
                {dealRoom.participants && dealRoom.participants.length > 0 ? (
                  <ul className={styles.participantsList}>
                    {dealRoom.participants.map((participant, index) => (
                      <li key={index}>{participant}</li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.noData}>No participants listed</p>
                )}
              </div>

              {dealRoom.description && (
                <div className={styles.infoCard}>
                  <h3 className={styles.infoCardTitle}>Description</h3>
                  <p className={styles.description}>{dealRoom.description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className={styles.documentsSection}>
            <div className={styles.documentsHeader}>
              <div className={styles.breadcrumbs}>
                {folderPath.map((path, index) => (
                  <span key={index}>
                    <button
                      className={styles.breadcrumb}
                      onClick={() => handleBreadcrumbClick(index)}
                      disabled={index === folderPath.length - 1}
                    >
                      {path.name}
                    </button>
                    {index < folderPath.length - 1 && <span className={styles.breadcrumbSeparator}>/</span>}
                  </span>
                ))}
              </div>
              <div className={styles.documentActions}>
                <button
                  className={styles.addButton}
                  onClick={() => setShowAddFolder(true)}
                >
                  <span className={styles.addIcon}>📁</span>
                  New Folder
                </button>
                <button
                  className={styles.addButton}
                  onClick={() => setShowAddDocument(true)}
                >
                  <span className={styles.addIcon}>+</span>
                  Add Document
                </button>
              </div>
            </div>

            {showAddFolder && (
              <div className={styles.addFolderModal}>
                <div className={styles.modalContent}>
                  <h3>Create New Folder</h3>
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Folder name"
                    className={styles.input}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFolder()}
                    autoFocus
                  />
                  <div className={styles.modalActions}>
                    <button onClick={() => { setShowAddFolder(false); setNewFolderName('') }} className={styles.cancelButton}>
                      Cancel
                    </button>
                    <button onClick={handleAddFolder} className={styles.submitButton}>
                      Create
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showAddDocument && (
              <div className={styles.addFolderModal}>
                <div className={styles.modalContent}>
                  <h3>Add Document</h3>
                  {error && (
                    <div className={styles.error} style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '0.5rem' }}>
                      <p style={{ margin: 0, fontSize: '0.875rem' }}>⚠️ {error}</p>
                    </div>
                  )}
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Document Title <span className={styles.required}>*</span></label>
                    <input
                      type="text"
                      value={documentTitle}
                      onChange={(e) => setDocumentTitle(e.target.value)}
                      placeholder="Enter document title"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>File <span className={styles.required}>*</span></label>
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      className={styles.fileInput}
                    />
                    {selectedFile && (
                      <p className={styles.fileInfo}>
                        Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                      </p>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Description</label>
                    <textarea
                      value={documentDescription}
                      onChange={(e) => setDocumentDescription(e.target.value)}
                      placeholder="Enter document description"
                      className={styles.textarea}
                      rows={3}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Location</label>
                    <p className={styles.locationInfo}>
                      {folderPath.map((p) => p.name).join(' / ')}
                    </p>
                  </div>
                  <div className={styles.modalActions}>
                    <button
                      onClick={() => {
                        setShowAddDocument(false)
                        setDocumentTitle('')
                        setDocumentDescription('')
                        setSelectedFile(null)
                        setError(null)
                      }}
                      className={styles.cancelButton}
                      disabled={uploading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddDocument}
                      className={styles.submitButton}
                      disabled={uploading || !selectedFile || !documentTitle.trim()}
                    >
                      {uploading ? 'Uploading...' : 'Add Document'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {documentsLoading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading documents...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📄</div>
                <h3>No Documents</h3>
                <p>Get started by adding a document or creating a folder</p>
              </div>
            ) : (
              <div className={styles.documentsList}>
                {documents.map((doc) => (
                  <div key={doc._id} className={styles.documentItem}>
                    <div className={styles.documentIcon}>
                      {doc.isFolder ? '📁' : '📄'}
                    </div>
                    <div className={styles.documentInfo}>
                      <div className={styles.documentName}>{doc.title}</div>
                      {!doc.isFolder && (
                        <div className={styles.documentMeta}>
                          {doc.fileSize && <span>{formatFileSize(doc.fileSize)}</span>}
                          {doc.fileType && <span>{doc.fileType}</span>}
                          {doc.createdAt && <span>{formatDate(doc.createdAt)}</span>}
                        </div>
                      )}
                    </div>
                    <div className={styles.documentActions}>
                      {doc.isFolder ? (
                        <button
                          className={styles.actionButton}
                          onClick={() => handleFolderNavigate(doc)}
                        >
                          Open
                        </button>
                      ) : (
                        doc.fileUrl && (
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.actionButton}
                          >
                            View
                          </a>
                        )
                      )}
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteDocument(doc._id, doc.isFolder)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

