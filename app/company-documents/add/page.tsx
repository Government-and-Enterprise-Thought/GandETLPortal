'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import styles from './page.module.css'

export default function AddCompanyDocumentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    documentType: '',
    description: '',
    fileUrl: '',
    fileName: '',
    fileSize: '',
    status: 'active',
    category: '',
    tags: '',
    relatedTo: '',
    notes: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        ...formData,
        fileSize: formData.fileSize ? parseFloat(formData.fileSize) : undefined,
        tags: formData.tags
          ? formData.tags.split(',').map((item) => item.trim()).filter(Boolean)
          : [],
      }

      const response = await fetch('/api/company-documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create company document')
      }

      router.push('/company-documents')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageTitle}>Add New Company Document</h2>
            <p className={styles.pageSubtitle}>Create a new company document record</p>
          </div>
          <Link href="/company-documents" className={styles.backButton}>
            ← Back to List
          </Link>
        </div>

        <div className={styles.formContainer}>
          {error && (
            <div className={styles.error}>
              <p>⚠️ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>
                Title <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Enter document title"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="documentType" className={styles.label}>
                  Document Type
                </label>
                <select
                  id="documentType"
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Select type</option>
                  <option value="contract">Contract</option>
                  <option value="agreement">Agreement</option>
                  <option value="report">Report</option>
                  <option value="proposal">Proposal</option>
                  <option value="policy">Policy</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="status" className={styles.label}>
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category" className={styles.label}>
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter category"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="fileUrl" className={styles.label}>
                  File URL
                </label>
                <input
                  type="url"
                  id="fileUrl"
                  name="fileUrl"
                  value={formData.fileUrl}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="https://example.com/document.pdf"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="fileName" className={styles.label}>
                  File Name
                </label>
                <input
                  type="text"
                  id="fileName"
                  name="fileName"
                  value={formData.fileName}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="document.pdf"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="fileSize" className={styles.label}>
                File Size (bytes)
              </label>
              <input
                type="number"
                id="fileSize"
                name="fileSize"
                value={formData.fileSize}
                onChange={handleChange}
                className={styles.input}
                placeholder="0"
                min="0"
                step="1"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Document description"
                rows={4}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="tags" className={styles.label}>
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className={styles.input}
                placeholder="tag1, tag2, tag3"
              />
              <small className={styles.helpText}>Separate multiple tags with commas</small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="relatedTo" className={styles.label}>
                Related To
              </label>
              <input
                type="text"
                id="relatedTo"
                name="relatedTo"
                value={formData.relatedTo}
                onChange={handleChange}
                className={styles.input}
                placeholder="Related entity or reference"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="notes" className={styles.label}>
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Additional notes or information"
                rows={5}
              />
            </div>

            <div className={styles.formActions}>
              <Link href="/company-documents" className={styles.cancelButton}>
                Cancel
              </Link>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Document'}
              </button>
            </div>
          </form>
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





