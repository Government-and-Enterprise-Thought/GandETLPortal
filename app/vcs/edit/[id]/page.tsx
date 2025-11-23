'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import styles from './page.module.css'

export default function EditVentureCapitalPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    email: '',
    fundSize: '',
    status: 'active',
    description: '',
    industryFocus: '',
    notes: '',
  })

  useEffect(() => {
    fetchVentureCapital()
  }, [id])

  const fetchVentureCapital = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/venture-capital/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch Venture Capital company')
      }
      const data = await response.json()
      setFormData({
        companyName: data.companyName || '',
        website: data.website || '',
        email: data.email || '',
        fundSize: data.fundSize?.toString() || '',
        status: data.status || 'active',
        description: data.description || '',
        industryFocus: data.industryFocus?.join(', ') || '',
        notes: data.notes || '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

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
    setSaving(true)
    setError(null)

    try {
      const payload = {
        ...formData,
        fundSize: formData.fundSize ? parseFloat(formData.fundSize) : undefined,
        industryFocus: formData.industryFocus
          ? formData.industryFocus.split(',').map((item) => item.trim()).filter(Boolean)
          : [],
      }

      const response = await fetch(`/api/venture-capital/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update Venture Capital company')
      }

      router.push(`/vcs/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this Venture Capital company? This action cannot be undone.')) {
      return
    }

    try {
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
    }
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

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageTitle}>Edit Venture Capital Company</h2>
            <p className={styles.pageSubtitle}>Update Venture Capital company record</p>
          </div>
          <Link href={`/vcs/${id}`} className={styles.backButton}>
            ← Back to Details
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
              <label htmlFor="companyName" className={styles.label}>
                Company Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Enter company name"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="website" className={styles.label}>
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="https://example.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="contact@example.com"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="fundSize" className={styles.label}>
                  Fund Size (USD)
                </label>
                <input
                  type="number"
                  id="fundSize"
                  name="fundSize"
                  value={formData.fundSize}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
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
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
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
                placeholder="Company description"
                rows={4}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="industryFocus" className={styles.label}>
                Industry Focus
              </label>
              <input
                type="text"
                id="industryFocus"
                name="industryFocus"
                value={formData.industryFocus}
                onChange={handleChange}
                className={styles.input}
                placeholder="Technology, Healthcare, Finance (comma-separated)"
              />
              <small className={styles.helpText}>Separate multiple industries with commas</small>
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
              <button
                type="button"
                onClick={handleDelete}
                className={styles.deleteButton}
              >
                Delete
              </button>
              <div className={styles.rightActions}>
                <Link href={`/vcs/${id}`} className={styles.cancelButton}>
                  Cancel
                </Link>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
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

