import { useEffect, useState } from 'react';
import api from '../services/api.js';

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#fff" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const WhatsappIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.975-1.306A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.952 7.952 0 0 1-4.104-1.14l-.295-.175-3.063.804.82-2.98-.193-.307A7.943 7.943 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.06 6.06l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const socialConfig = [
  { key: 'facebook',  Icon: FacebookIcon,  bg: '#1877f2', label: 'Facebook',  hrefFn: (v) => v },
  { key: 'twitter',   Icon: XIcon,         bg: '#000',    label: 'X',         hrefFn: (v) => v },
  { key: 'youtube',   Icon: YoutubeIcon,   bg: '#ff0000', label: 'YouTube',   hrefFn: (v) => v },
  { key: 'instagram', Icon: InstagramIcon, bg: '#e1306c', label: 'Instagram', hrefFn: (v) => v },
  { key: 'whatsapp',  Icon: WhatsappIcon,  bg: '#25d366', label: 'WhatsApp',  hrefFn: (v) => v },
  { key: 'phone',     Icon: PhoneIcon,     bg: '#f97316', label: 'Phone',     hrefFn: (v) => `tel:${v}` },
];

const SocialBar = () => {
  const [links, setLinks] = useState({});

  useEffect(() => {
    api.get('/settings')
      .then((res) => setLinks(res.data || {}))
      .catch(() => {});
  }, []);

  return (
    <div className="social-bar" aria-label="Social media links">
      {socialConfig.map(({ key, Icon, bg, label, hrefFn }) => {
        const value = links[key];

        if (!value) {
          return (
            <button
              key={key}
              type="button"
              className="social-bar-btn social-bar-btn-disabled"
              style={{ '--sb-color': bg }}
              aria-label={`${label} link not set`}
              title={`${label} link not set yet`}
            >
              <Icon />
            </button>
          );
        }

        return (
          <a
            key={key}
            href={hrefFn(value)}
            target={key === 'phone' ? '_self' : '_blank'}
            rel="noopener noreferrer"
            className="social-bar-btn"
            style={{ '--sb-color': bg }}
            aria-label={label}
            title={label}
          >
            <Icon />
          </a>
        );
      })}
    </div>
  );
};

export default SocialBar;
