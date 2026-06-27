import { useState } from 'react'
import { useStudio } from '../StudioContext'

const URL = 'https://quran-captions.waleed-dev.com'
const TEXT = 'Quran Captions — create transparent-PNG Qur’an verse captions for your videos'
const enc = encodeURIComponent

const Icon = ({ children }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
    {children}
  </svg>
)

const OPTIONS = [
  {
    name: 'X',
    color: '#000000',
    href: `https://twitter.com/intent/tweet?url=${enc(URL)}&text=${enc(TEXT)}`,
    icon: (
      <Icon>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
      </Icon>
    ),
  },
  {
    name: 'WhatsApp',
    color: '#25D366',
    href: `https://wa.me/?text=${enc(TEXT + ' ' + URL)}`,
    icon: (
      <Icon>
        <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.82 9.82 0 0 0 1.51 5.26l-.998 3.648 3.738-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
      </Icon>
    ),
  },
  {
    name: 'Telegram',
    color: '#229ED9',
    href: `https://t.me/share/url?url=${enc(URL)}&text=${enc(TEXT)}`,
    icon: (
      <Icon>
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </Icon>
    ),
  },
  {
    name: 'Facebook',
    color: '#1877F2',
    href: `https://www.facebook.com/sharer/sharer.php?u=${enc(URL)}`,
    icon: (
      <Icon>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </Icon>
    ),
  },
  {
    name: 'LinkedIn',
    color: '#0A66C2',
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(URL)}`,
    icon: (
      <Icon>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </Icon>
    ),
  },
  {
    name: 'Email',
    color: '#6b7280',
    href: `mailto:?subject=${enc('Quran Captions')}&body=${enc(TEXT + '\n\n' + URL)}`,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
        <path d="m3 6.5 9 6 9-6" />
      </svg>
    ),
  },
]

export default function ShareModal() {
  const { state, t, actions, tr } = useStudio()
  const [copied, setCopied] = useState(false)
  if (!state.share) return null

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(URL)
    } catch {
      /* clipboard may be blocked; ignore */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const close = () => {
    setCopied(false)
    actions.closeShare()
  }

  return (
    <div
      onClick={close}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(10,12,16,.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 440,
          maxWidth: '92%',
          background: t.panel,
          border: `1px solid ${t.border}`,
          borderRadius: 16,
          boxShadow: '0 24px 70px rgba(0,0,0,.34)',
          padding: 22,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: t.text }}>{tr('share.title')}</div>
          <button
            onClick={close}
            aria-label="Close"
            style={{
              width: 30,
              height: 30,
              border: 0,
              borderRadius: 8,
              background: t.panel2,
              color: t.sub,
              cursor: 'pointer',
              fontSize: 17,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        <div style={{ fontWeight: 500, fontSize: 12, color: t.faint, marginTop: 3 }}>
          {tr('share.subtitle')}
        </div>

        {/* Share targets */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
            margin: '20px 0 18px',
          }}
        >
          {OPTIONS.map((o) => (
            <a
              key={o.name}
              href={o.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                padding: '14px 6px',
                borderRadius: 12,
                border: `1px solid ${t.border}`,
                background: t.panel2,
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: o.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {o.icon}
              </span>
              <span style={{ fontWeight: 600, fontSize: 11.5, color: t.text }}>{o.name}</span>
            </a>
          ))}
        </div>

        {/* Copy link */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 6px 6px 12px',
            border: `1px solid ${t.border}`,
            borderRadius: 10,
            background: t.input,
          }}
        >
          <span
            style={{
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontWeight: 600,
              fontSize: 12.5,
              color: t.sub,
            }}
          >
            {URL}
          </span>
          <button
            onClick={copy}
            style={{
              flex: 'none',
              padding: '8px 16px',
              border: 0,
              borderRadius: 8,
              background: copied ? t.accent : t.text,
              color: copied ? '#fff' : t.panel,
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 12.5,
              fontFamily: 'inherit',
            }}
          >
            {copied ? tr('share.copied') : tr('share.copy')}
          </button>
        </div>
      </div>
    </div>
  )
}
