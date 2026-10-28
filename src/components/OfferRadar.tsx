import React, { useEffect, useState } from 'react';
import type { DispatchOffer } from '../types';
import { Timer, CheckCircle, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';

interface OfferRadarProps {
  offers: DispatchOffer[];
  onAccept: (offer: DispatchOffer) => void;
  onDecline: (offerId: string) => void;
}

export const OfferRadar: React.FC<OfferRadarProps> = ({ offers, onAccept, onDecline }) => {
  if (offers.length === 0) return null;

  return (
    <div className="offer-radar-list">
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
    <div className={`offer-radar-card animate-slide-down ${isUrgent ? 'urgent' : ''}`}>
      {/* Top Countdown Bar */}
      <div className="offer-countdown-bar-track">
        <div
          className={`offer-countdown-bar-fill ${isUrgent ? 'urgent' : ''}`}
          style={{ width: `${percentLeft}%` }}
        />
      </div>

      <div className="offer-content-row">
        {/* Left Info */}
        <div className="offer-info-col">
          <div className="offer-meta-row">
            <span className="offer-fast-pill">
              <Zap size={11} />
              60s Fast Race
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Issue #{offer.issueId} • {offer.repo}
            </span>
            {offer.type === 'pr_review' ? (
              <span className="offer-safety-pill safe">
                <ShieldCheck size={12} />
                Safe PR Review (Zero Risk)
              </span>
            ) : (
              <span className="offer-safety-pill claim">
                Solver Claim (Requires Write Access)
              </span>
            )}
          </div>

          <h3 className="offer-title">
            {offer.title}
          </h3>

          {offer.friendlyExplanation ? (
            <p className="offer-explanation-text">
              {offer.friendlyExplanation}
            </p>
          ) : (
            <p className="offer-explanation-text">
              {offer.notes}
            </p>
          )}

          {offer.pullRequestUrl && (
            <a
              href={offer.pullRequestUrl}
              target="_blank"
              rel="noreferrer"
              className="offer-pr-link"
            >
              <span>Inspect PR on GitHub</span>
              <ArrowUpRight size={13} />
            </a>
          )}
        </div>

        {/* Right Timer & 1-Tap Claim */}
        <div className="offer-action-col">
          <div className={`offer-timer-box ${isUrgent ? 'urgent' : ''}`}>
            <Timer size={15} />
            <span>{timeLeft}s left</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onDecline}
              className="btn-decline"
              aria-label="Pass on offer"
            >
              Pass
            </button>
            <button
              onClick={onAccept}
              className="btn-primary"
              aria-label="Accept 60s offer"
            >
              <CheckCircle size={15} />
              <span>Claim (+{offer.points} pts)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
