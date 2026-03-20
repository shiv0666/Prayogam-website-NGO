import { useState, useMemo } from 'react';

const impactTiers = [
  {
    amount: 100,
    label: '₹100',
    impacts: [
      { icon: '📚', category: 'Education', text: 'Provides stationery & books for 1 child for a month' },
      { icon: '🍱', category: 'Social', text: 'Covers 5 nutritious meals for an underprivileged child' },
      { icon: '🌱', category: 'Environment', text: 'Plants 5 saplings in underserved communities' },
      { icon: '💊', category: 'Healthcare', text: 'Funds 1 basic health consultation' }
    ]
  },
  {
    amount: 250,
    label: '₹250',
    impacts: [
      { icon: '📖', category: 'Education', text: 'Buys a complete set of textbooks for 1 student' },
      { icon: '🤝', category: 'Social', text: 'Covers 1 family\'s community support kit' },
      { icon: '🌿', category: 'Environment', text: 'Plants 12 saplings and covers 1 awareness session' },
      { icon: '🩺', category: 'Healthcare', text: 'Provides 2 health check-ups for children' }
    ]
  },
  {
    amount: 500,
    label: '₹500',
    impacts: [
      { icon: '🏫', category: 'Education', text: '1 month\'s coaching support for a student' },
      { icon: '🧑‍🤝‍🧑', category: 'Social', text: 'Funds a community awareness workshop for 10 people' },
      { icon: '♻️', category: 'Environment', text: 'Sponsors a full cleanliness drive in 1 locality' },
      { icon: '💉', category: 'Healthcare', text: 'Covers a family health first-aid kit' }
    ]
  },
  {
    amount: 1000,
    label: '₹1,000',
    impacts: [
      { icon: '🎒', category: 'Education', text: '1 month\'s education support for 2 children' },
      { icon: '🏘️', category: 'Social', text: 'Rehabilitates 1 family with social welfare support' },
      { icon: '🌳', category: 'Environment', text: 'Plants 50 trees and runs 1 eco-awareness camp' },
      { icon: '🏥', category: 'Healthcare', text: 'Vaccines & medicines for 5 children' }
    ]
  },
  {
    amount: 2500,
    label: '₹2,500',
    impacts: [
      { icon: '🎓', category: 'Education', text: 'Partial scholarship for 1 child for a quarter term' },
      { icon: '🧹', category: 'Social', text: 'Funds 1 month of livelihood training for 1 person' },
      { icon: '💧', category: 'Environment', text: 'Provides clean water access for 1 family for 3 months' },
      { icon: '🩻', category: 'Healthcare', text: 'Runs a health screening camp for 10 people' }
    ]
  },
  {
    amount: 5000,
    label: '₹5,000',
    impacts: [
      { icon: '📝', category: 'Education', text: 'Fully supports a study circle of 5 children for 1 month' },
      { icon: '🌍', category: 'Social', text: 'Runs a month-long social integration program for 15 people' },
      { icon: '🔆', category: 'Environment', text: 'Solar lighting installation for 2 community spaces' },
      { icon: '🏨', category: 'Healthcare', text: 'Funds a mobile health unit visit to a remote village' }
    ]
  },
  {
    amount: 10000,
    label: '₹10,000',
    impacts: [
      { icon: '🏆', category: 'Education', text: 'School supplies + coaching for an entire classroom' },
      { icon: '🤲', category: 'Social', text: 'Funds a skill-development workshop for 25 youth' },
      { icon: '🌊', category: 'Environment', text: 'Builds a micro-water conservation structure for a village' },
      { icon: '🏋️', category: 'Healthcare', text: 'Nutrition program for 20 children for 1 month' }
    ]
  },
  {
    amount: 25000,
    label: '₹25,000',
    impacts: [
      { icon: '🔬', category: 'Education', text: 'Runs a full education centre for 1 month' },
      { icon: '🏗️', category: 'Social', text: 'Builds basic infrastructure for 1 community space' },
      { icon: '🌏', category: 'Environment', text: 'Sponsors a forest conservation micro-project' },
      { icon: '🩺', category: 'Healthcare', text: 'Funds a full health camp serving 50 families' }
    ]
  },
  {
    amount: 50000,
    label: '₹50,000',
    impacts: [
      { icon: '🎪', category: 'Education', text: 'Supports an entire program initiative for 1 month' },
      { icon: '🙌', category: 'Social', text: 'Transforms livelihoods for 10 families for a season' },
      { icon: '🌲', category: 'Environment', text: 'Restores 1 degraded land patch with planted trees' },
      { icon: '❤️‍🩹', category: 'Healthcare', text: 'Covers medical costs for 20 underprivileged families' }
    ]
  }
];

const categoryColors = {
  Education: { bg: '#eff6ff', border: '#2563eb', icon: '#2563eb' },
  Social: { bg: '#f0fdf4', border: '#10b981', icon: '#10b981' },
  Environment: { bg: '#f0fdf4', border: '#16a34a', icon: '#16a34a' },
  Healthcare: { bg: '#fff7ed', border: '#f97316', icon: '#f97316' }
};

const ImpactCalculator = () => {
  const [sliderIndex, setSliderIndex] = useState(2); // default ₹500

  const tier = impactTiers[sliderIndex];

  const formatAmount = (n) =>
    n >= 100000
      ? `₹${(n / 100000).toFixed(1)}L`
      : n >= 1000
      ? `₹${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`
      : `₹${n}`;

  return (
    <div className="impact-calculator">
      <div className="impact-calc-header">
        <h3 className="section-title h4 mb-1">Your Impact Calculator</h3>
        <p className="text-muted mb-0 small">Slide to see exactly what your donation funds</p>
      </div>

      <div className="impact-calc-slider-area">
        <div className="impact-calc-amount">{tier.label}</div>
        <input
          type="range"
          className="impact-calc-range"
          min={0}
          max={impactTiers.length - 1}
          value={sliderIndex}
          onChange={(e) => setSliderIndex(Number(e.target.value))}
          aria-label="Donation amount selector"
        />
        <div className="impact-calc-ticks">
          {impactTiers.map((t, i) => (
            <button
              key={t.amount}
              type="button"
              className={`impact-calc-tick${i === sliderIndex ? ' active' : ''}`}
              onClick={() => setSliderIndex(i)}
              aria-label={`Set amount to ${t.label}`}
            >
              {formatAmount(t.amount)}
            </button>
          ))}
        </div>
      </div>

      <div className="impact-calc-cards">
        {tier.impacts.map((item) => {
          const colors = categoryColors[item.category] || categoryColors.Education;
          return (
            <div
              key={item.category}
              className="impact-calc-card"
              style={{ background: colors.bg, borderColor: colors.border }}
            >
              <span className="impact-calc-icon" style={{ color: colors.icon }}>{item.icon}</span>
              <div>
                <div className="impact-calc-category" style={{ color: colors.icon }}>{item.category}</div>
                <div className="impact-calc-text">{item.text}</div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="impact-calc-note">
        * Impact estimates are based on average program costs. Every rupee goes directly to the field.
      </p>
    </div>
  );
};

export default ImpactCalculator;
