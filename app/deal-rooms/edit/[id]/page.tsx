'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import styles from '../../add/page.module.css'

export default function EditDealRoomPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    dealType: '',
    dealValue: '',
    currency: 'USD',
    participants: '',
    startDate: '',
    endDate: '',
    location: '',
    notes: '',
  })

  useEffect(() => {
    if (id) {
      fetchDealRoom()
    }
  }, [id])

  const fetchDealRoom = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/deal-rooms/${id}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Deal room not found')
        }
        throw new Error('Failed to fetch deal room')
      }
      const data = await response.json()
      
      // Format dates for input fields (YYYY-MM-DD)
      const formatDateForInput = (dateString?: string) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
      }

      setFormData({
        name: data.name || '',
        description: data.description || '',
        status: data.status || 'active',
        dealType: data.dealType || '',
        dealValue: data.dealValue?.toString() || '',
        currency: data.currency || 'USD',
        participants: data.participants?.join(', ') || '',
        startDate: formatDateForInput(data.startDate),
        endDate: formatDateForInput(data.endDate),
        location: data.location || '',
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
        dealValue: formData.dealValue ? parseFloat(formData.dealValue) : undefined,
        participants: formData.participants
          ? formData.participants.split(',').map((item) => item.trim()).filter(Boolean)
          : [],
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      }

      const response = await fetch(`/api/deal-rooms/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update deal room')
      }

      router.push(`/deal-rooms/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setSaving(false)
    }
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

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div>
            <h2 className={styles.pageTitle}>Edit Deal Room</h2>
            <p className={styles.pageSubtitle}>Update deal room information</p>
          </div>
          <Link href={`/deal-rooms/${id}`} className={styles.backButton}>
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
                Deal Room Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Enter deal room name"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="dealType" className={styles.label}>
                  Deal Type
                </label>
                <select
                  id="dealType"
                  name="dealType"
                  value={formData.dealType}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Select deal type</option>
                  <option value="acquisition">Acquisition</option>
                  <option value="merger">Merger</option>
                  <option value="investment">Investment</option>
                  <option value="partnership">Partnership</option>
                  <option value="statement-of-work">Statement of Work</option>
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
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="dealValue" className={styles.label}>
                  Deal Value
                </label>
                <input
                  type="number"
                  id="dealValue"
                  name="dealValue"
                  value={formData.dealValue}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="currency" className={styles.label}>
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                  <option value="CAD">CAD</option>
                  <option value="AUD">AUD</option>
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="startDate" className={styles.label}>
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="endDate" className={styles.label}>
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="location" className={styles.label}>
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter location"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="participants" className={styles.label}>
                Participants
              </label>
              <input
                type="text"
                id="participants"
                name="participants"
                value={formData.participants}
                onChange={handleChange}
                className={styles.input}
                placeholder="participant1, participant2, participant3"
              />
              <small className={styles.helpText}>Separate multiple participants with commas</small>
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
                placeholder="Deal room description"
                rows={4}
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
              <Link href={`/deal-rooms/${id}`} className={styles.cancelButton}>
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

