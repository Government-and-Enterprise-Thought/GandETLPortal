'use client'

import Header from '@/components/Header'
import styles from './page.module.css'

const investmentTypes = [
  {
    id: 'vc',
    number: '01',
    title: 'Venture Capital (VC) Firms',
    tag: 'Early-stage private',
    subtitle: 'Invest in startups and early-stage companies with high growth potential.',
    items: [
      'Focus on startups and young companies, often pre-profit or even pre-revenue.',
      'Typically take minority stakes (e.g., 5–30%).',
      'High risk, but potential for very high returns (10x–100x).',
      'Capital is used for product development, hiring, and market expansion.',
    ],
  },
  {
    id: 'pe',
    number: '02',
    title: 'Private Equity (PE) Firms',
    tag: 'Control private',
    subtitle: 'Buy established, usually profitable companies, often taking full or majority control.',
    items: [
      'Target mature businesses with stable or improvable cash flow.',
      'Typically buy majority or 100% ownership.',
      'Often use leveraged buyouts (LBOs) with significant debt.',
      'Aim to improve operations, grow value, then exit via sale or IPO.',
    ],
  },
  {
    id: 'growth-equity',
    number: '03',
    title: 'Growth Equity Firms',
    tag: 'Scale-up capital',
    subtitle: 'Invest in fast-growing companies that are past the startup phase but not ready for a full buyout.',
    items: [
      'Target companies with proven revenue and strong growth.',
      'Usually take minority stakes rather than full control.',
      'Capital is used for expansion: new markets, products, or acquisitions.',
    ],
  },
  {
    id: 'hedge-funds',
    number: '04',
    title: 'Hedge Funds',
    tag: 'Alternative public markets',
    subtitle: 'Use advanced trading strategies in public markets to seek high risk-adjusted returns.',
    items: [
      'Trade stocks, bonds, currencies, derivatives, and more.',
      'Can go long/short, use leverage, options, and macro or quantitative strategies.',
      'Generally open only to institutional and high-net-worth investors.',
    ],
  },
  {
    id: 'mutual-funds',
    number: '05',
    title: 'Mutual Funds',
    tag: 'Retail pooled',
    subtitle: 'Pool money from many investors to invest in diversified portfolios of stocks, bonds, or both.',
    items: [
      'Highly regulated and widely used for retail investing.',
      'Priced once per day at net asset value (NAV).',
      'Common in retirement accounts and long-term savings plans.',
    ],
  },
  {
    id: 'etfs',
    number: '06',
    title: 'Exchange-Traded Funds (ETFs)',
    tag: 'Listed pooled',
    subtitle: 'Similar to mutual funds but trade on stock exchanges like individual shares.',
    items: [
      'Track indices, sectors, factors, commodities, or bonds.',
      'Generally offer lower fees than active mutual funds.',
      'Can be bought or sold throughout the trading day.',
    ],
  },
  {
    id: 'index-funds',
    number: '07',
    title: 'Index Funds',
    tag: 'Passive',
    subtitle: 'Passively track a specific market index such as the S&P 500 or FTSE 100.',
    items: [
      'Structured as mutual funds or ETFs.',
      'Very low fees due to passive management.',
      'Aim to match, not beat, the market\'s performance.',
    ],
  },
  {
    id: 'reits',
    number: '08',
    title: 'Real Estate Investment Trusts (REITs)',
    tag: 'Property',
    subtitle: 'Own or finance income-producing real estate portfolios.',
    items: [
      'Invest in commercial, residential, industrial, data center, or healthcare properties.',
      'Often required to distribute a large share of income as dividends.',
      'Can be publicly listed or privately held.',
    ],
  },
  {
    id: 'family-offices',
    number: '09',
    title: 'Family Offices',
    tag: 'Ultra-high-net-worth',
    subtitle: 'Manage the wealth and affairs of ultra-high-net-worth individuals or families.',
    items: [
      'Can be single-family or multi-family offices.',
      'Invest across all asset classes including PE, VC, real estate, and hedge funds.',
      'Also handle tax, estate planning, administration, and philanthropy.',
    ],
  },
  {
    id: 'swf',
    number: '10',
    title: 'Sovereign Wealth Funds (SWFs)',
    tag: 'State capital',
    subtitle: 'State-owned funds that invest a country\'s surplus reserves for long-term national benefit.',
    items: [
      'Invest in global equities, bonds, infrastructure, real estate, PE, and VC.',
      'Have very long investment horizons.',
      'Examples include ADIA (UAE) and GIC (Singapore).',
    ],
  },
  {
    id: 'asset-managers',
    number: '11',
    title: 'Asset Management Firms',
    tag: 'Institutional & retail',
    subtitle: 'Manage investment portfolios on behalf of institutions and individuals.',
    items: [
      'Offer mutual funds, ETFs, and discretionary mandates.',
      'Invest in stocks, bonds, real estate, and alternative assets.',
      'Examples include BlackRock, Vanguard, and Fidelity.',
    ],
  },
  {
    id: 'investment-banks',
    number: '12',
    title: 'Investment Banks',
    tag: 'Advisory & capital markets',
    subtitle: 'Advise on and arrange large financial transactions; some operate investing arms.',
    items: [
      'Help companies raise capital through IPOs and bond issues.',
      'Advise on mergers, acquisitions, and restructurings.',
      'May also operate trading, asset management, or private equity divisions.',
    ],
  },
  {
    id: 'hf-funds-of-funds',
    number: '13',
    title: 'Hedge Fund of Funds',
    tag: 'Multi-manager',
    subtitle: 'Invest in multiple hedge funds rather than directly in securities.',
    items: [
      'Provide diversification across strategies and managers.',
      'Come with an extra fee layer (fund plus underlying hedge funds).',
    ],
  },
  {
    id: 'pe-funds-of-funds',
    number: '14',
    title: 'Private Equity Fund of Funds',
    tag: 'PE multi-manager',
    subtitle: 'Invest in a portfolio of private equity funds rather than directly in companies.',
    items: [
      'Diversify across PE managers, strategies, and regions.',
      'Frequently used by institutions seeking broad PE exposure.',
    ],
  },
  {
    id: 'holding-companies',
    number: '15',
    title: 'Holding / Investment Companies',
    tag: 'Long-term ownership',
    subtitle: 'Own stakes in other companies, sometimes fully, sometimes partially.',
    items: [
      'Can hold both private and public companies.',
      'Often have a long-term, strategic ownership mindset.',
      'Examples include conglomerates and groups like Berkshire Hathaway.',
    ],
  },
  {
    id: 'incubators',
    number: '16',
    title: 'Incubators & Accelerators',
    tag: 'Pre-seed & seed',
    subtitle: 'Support very early-stage startups with capital, mentorship, and resources.',
    items: [
      'Provide small amounts of capital in exchange for equity.',
      'Offer mentorship, networks, and sometimes workspace.',
      'Usually run fixed-term programs (e.g., 3–6 months).',
    ],
  },
  {
    id: 'pension-funds',
    number: '17',
    title: 'Pension Funds',
    tag: 'Retirement capital',
    subtitle: 'Invest retirement savings on behalf of workers and retirees.',
    items: [
      'Very large institutional investors with long-term obligations.',
      'Invest in public markets, bonds, private equity, real estate, and infrastructure.',
      'Focus on long-term, stable returns to meet future payouts.',
    ],
  },
  {
    id: 'commodity-funds',
    number: '18',
    title: 'Commodity & Natural Resource Funds',
    tag: 'Real assets',
    subtitle: 'Invest in commodities or companies tied to natural resources.',
    items: [
      'May invest in oil, gas, metals, agriculture, or related equities.',
      'Can be structured as mutual funds, ETFs, hedge funds, or PE funds.',
    ],
  },
  {
    id: 'quant-funds',
    number: '19',
    title: 'Quantitative Investment Funds',
    tag: 'Systematic',
    subtitle: 'Use algorithms and statistical models to make systematic trading decisions.',
    items: [
      'Heavily data-driven, often using factor models or machine learning.',
      'Typically structured as hedge funds or institutional mandates.',
      'Strategies may include statistical arbitrage, trend-following, or factor investing.',
    ],
  },
]

export default function DefinitionsPage() {
  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.badge}>
            <span className={styles.badgeDot}></span>
            Investment Company Primer
          </div>
          <h1 className={styles.title}>Types of Investment Companies &amp; Vehicles</h1>
          <p className={styles.subtitle}>
            A concise reference describing the main types of investment companies and
            structures across venture capital, private equity, hedge funds, real
            estate, and institutional capital.
          </p>
        </header>

        <div className={styles.layout}>
          {/* Sidebar / TOC */}
          <aside className={styles.sidebar}>
            <h2 className={styles.sidebarTitle}>On this page</h2>
            <p className={styles.tocIntro}>Quick navigation to each investment type.</p>
            <ul className={styles.tocList}>
              {investmentTypes.map((type) => (
                <li key={type.id}>
                  <a className={styles.tocLink} href={`#${type.id}`}>
                    <span>{type.number}.</span> {type.title.replace(/ \(.*?\)/g, '')}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main content */}
          <main className={styles.content}>
            {investmentTypes.map((type) => (
              <section key={type.id} className={styles.section} id={type.id}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    {type.number.replace(/^0/, '')}. {type.title}
                  </h2>
                  <span className={styles.sectionTag}>{type.tag}</span>
                </div>
                <p className={styles.sectionSubtitle}>{type.subtitle}</p>
                <ul>
                  {type.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </main>
        </div>
      </div>
    </div>
  )
}

