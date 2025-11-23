'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import styles from './page.module.css'

export default function PortalPage() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const portalSections = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: '📊',
      description: 'Get a comprehensive view of your data pipeline status',
    },
    {
      id: 'overview',
      title: 'Overview',
      icon: '👁️',
      description: 'Get a comprehensive view of your data pipeline status',
    },
    {
      id: 'pipelines',
      title: 'Data Pipelines',
      icon: '🔄',
      description: 'Manage and monitor your ETL pipelines',
    },
    {
      id: 'datasets',
      title: 'Datasets',
      icon: '📁',
      description: 'Browse and manage your data collections',
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: '📈',
      description: 'View insights and performance metrics',
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: '⚙️',
      description: 'Configure your portal preferences',
    },
  ]

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <div className={styles.hero}>
          <h2 className={styles.heroTitle}>Welcome to GETL Portal</h2>
          <p className={styles.heroSubtitle}>
            Your central hub for managing data pipelines, transformations, and analytics
          </p>
        </div>

        <div className={styles.tabs}>
          {portalSections.map((section) => (
            <button
              key={section.id}
              className={`${styles.tab} ${activeTab === section.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(section.id)}
            >
              <span className={styles.tabIcon}>{section.icon}</span>
              <span className={styles.tabTitle}>{section.title}</span>
            </button>
          ))}
        </div>

        <div className={styles.content}>
          {portalSections.map((section) => (
            <div
              key={section.id}
              className={`${styles.section} ${activeTab === section.id ? styles.sectionActive : ''}`}
            >
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>{section.icon}</span>
                <h3 className={styles.sectionTitle}>{section.title}</h3>
              </div>
              <p className={styles.sectionDescription}>{section.description}</p>
              <div className={styles.sectionContent}>
                <div className={styles.card}>
                  <h4>Quick Actions</h4>
                  <div className={styles.actionButtons}>
                    <button className={styles.actionButton}>View Details</button>
                    <button className={styles.actionButton}>Create New</button>
                    <button className={styles.actionButton}>Export Data</button>
                  </div>
                </div>
                <div className={styles.card}>
                  <h4>Recent Activity</h4>
                  <ul className={styles.activityList}>
                    <li>Pipeline &quot;ETL_Process_01&quot; completed successfully</li>
                    <li>Dataset &quot;Sales_Data_2024&quot; updated</li>
                    <li>New transformation rule added</li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
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

