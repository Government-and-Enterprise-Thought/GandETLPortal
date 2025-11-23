'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import styles from './page.module.css'

export default function EditUHNWIPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    netWorth: '',
    status: 'active',
    notes: '',
  })

  useEffect(() => {
    fetchUHNWI()
  }, [id])

  const fetchUHNWI = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/uhnwi/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch UHNWI')
      }
      const data = await response.json()
      setFormData({
        name: data.name || '',
        email: data.email || '',
        netWorth: data.netWorth?.toString() || '',
        status: data.status || 'active',
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
        netWorth: formData.netWorth ? parseFloat(formData.netWorth) : undefined,
      }

      const response = await fetch(`/api/uhnwi/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update UHNWI')
      }

      router.push(`/uhnwi/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this UHNWI record? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/uhnwi/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete UHNWI')
      }

      router.push('/uhnwi')
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
          <p>Loading UHNWI record...</p>
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
            <h2 className={styles.pageTitle}>Edit UHNWI</h2>
            <p className={styles.pageSubtitle}>Update Ultra High Net Worth Individual record</p>
          </div>
          <Link href={`/uhnwi/${id}`} className={styles.backButton}>
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
              <label htmlFor="name" className={styles.label}>
                Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Enter full name"
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
                placeholder="Enter email address"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="netWorth" className={styles.label}>
                  Net Worth (USD)
                </label>
                <input
                  type="number"
                  id="netWorth"
                  name="netWorth"
                  value={formData.netWorth}
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
                <Link href={`/uhnwi/${id}`} className={styles.cancelButton}>
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

