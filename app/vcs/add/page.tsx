'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import styles from './page.module.css'

export default function AddVentureCapitalPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
        fundSize: formData.fundSize ? parseFloat(formData.fundSize) : undefined,
        industryFocus: formData.industryFocus
          ? formData.industryFocus.split(',').map((item) => item.trim()).filter(Boolean)
          : [],
      }

      const response = await fetch('/api/venture-capital', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create Venture Capital company')
      }

      router.push('/vcs')
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
            <h2 className={styles.pageTitle}>Add New Venture Capital Company</h2>
            <p className={styles.pageSubtitle}>Create a new Venture Capital company record</p>
          </div>
          <Link href="/vcs" className={styles.backButton}>
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
              <Link href="/vcs" className={styles.cancelButton}>
                Cancel
              </Link>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Company'}
              </button>
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

