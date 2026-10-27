import React, { useEffect, useState } from 'react';
import type { DispatchOffer } from '../types';
import { Timer, CheckCircle, ArrowUpRight } from 'lucide-react';

interface OfferRadarProps {
  offers: DispatchOffer[];
  onAccept: (offer: DispatchOffer) => void;
  onDecline: (offerId: string) => void;
}

export const OfferRadar: React.FC<OfferRadarProps> = ({ offers, onAccept, onDecline }) => {
  if (offers.length === 0) return null;

  return (
    <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {offers.map((offer) => (
        <SingleOfferCard
          key={offer.id}
          offer={offer}
          onAccept={() => onAccept(offer)}
          onDecline={() => onDecline(offer.id)}
        />
      ))}
    </div>
  );
};

const SingleOfferCard: React.FC<{
  offer: DispatchOffer;
  onAccept: () => void;
  onDecline: () => void;
}> = ({ offer, onAccept, onDecline }) => {
  // Initialized from offer.secondsRemaining, component remounts on key change
  const [timeLeft, setTimeLeft] = useState(offer.secondsRemaining);

  useEffect(() => {
    if (timeLeft <= 0) {
      onDecline();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onDecline]);

  const percentLeft = Math.round((timeLeft / 60) * 100);
  const isUrgent = timeLeft < 15;

  return (
    <div
      className="animate-slide-down"
      style={{
        background: '#ffffff',
        border: isUrgent ? '1.5px solid #ef4444' : '1.5px solid #bfdbfe',
        borderRadius: '14px',
        padding: '18px 22px',
        boxShadow: isUrgent
          ? '0 4px 14px rgba(239, 68, 68, 0.12)'
          : '0 4px 14px rgba(37, 99, 235, 0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Countdown Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: '#f1f5f9',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percentLeft}%`,
            background: isUrgent ? '#ef4444' : '#2563eb',
            transition: 'width 1s linear',
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px' }}>
        {/* Left: Info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                background: '#eff6ff',
                color: '#2563eb',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '3px 8px',
                borderRadius: '6px',
                letterSpacing: '0.4px',
              }}
            >
              ⚡ 60s Dispatch Offer
            </span>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
              Issue #{offer.issueId} • {offer.repo}
            </span>
            {offer.type === 'pr_review' ? (
              <span
                style={{
                  background: '#ecfdf5',
                  color: '#059669',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  border: '1px solid #a7f3d0',
                }}
              >
                Safe PR Review (No Write Access Needed)
              </span>
            ) : (
              <span
                style={{
                  background: '#fffbeb',
                  color: '#b45309',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  border: '1px solid #fde68a',
                }}
              >
                Solver Claim (Requires Write Access)
              </span>
            )}
          </div>

          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
            {offer.title}
          </h3>

          <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.4, marginBottom: '8px' }}>
            {offer.notes}
          </p>

          {offer.pullRequestUrl && (
            <a
              href={offer.pullRequestUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                color: '#2563eb',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Inspect Pull Request diff
              <ArrowUpRight size={13} />
            </a>
          )}
        </div>

        {/* Right: Timer & 1-Tap Handshake Action */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
          {/* Timer Display */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: isUrgent ? '#ef4444' : '#2563eb',
              fontWeight: 800,
              fontSize: '14px',
              background: isUrgent ? '#fef2f2' : '#eff6ff',
              padding: '6px 12px',
              borderRadius: '8px',
              border: isUrgent ? '1px solid #fecaca' : '1px solid #bfdbfe',
            }}
          >
            <Timer size={16} />
            <span>{timeLeft}s left</span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onDecline}
              style={{
                background: '#ffffff',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              Pass
            </button>
            <button
              onClick={onAccept}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
              }}
            >
              <CheckCircle size={15} />
              <span>Accept Claim (+{offer.points} pts)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
