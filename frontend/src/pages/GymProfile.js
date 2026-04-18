import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import ReviewCard from '../components/ReviewCard';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/helpers';

const REVIEW_NAMES = ['Aarav', 'Riya', 'Kunal', 'Ishita', 'Dev', 'Neha', 'Vikram', 'Ananya'];
const REVIEW_COMMENTS = [
  'Clean equipment and great crowd. Worth the price.',
  'Trainers are helpful and sessions are energetic.',
  'Good value membership with enough weights and machines.',
  'Locker rooms are clean and timings are flexible.',
  'Cardio section is strong. Peak hour can get crowded.',
  'Loved the vibe and group classes.',
  'Power racks are excellent and usually available.',
  'Overall a reliable gym for consistent workouts.'
];

const BASE_REVIEWS = [
  { name: 'Alex R.', date: '2 weeks ago', rating: 5, comment: 'Best gym in the area by far. The equipment is always clean and well maintained.' },
  { name: 'Samira K.', date: '1 month ago', rating: 4, comment: 'Love the group classes! Wish they had more parking spaces though.' },
  { name: 'Jordan M.', date: '2 months ago', rating: 5, comment: 'Great value for the price. The sauna is a huge plus after a hard workout.' }
];

const TOTAL_REVIEWS = 124;

const INITIAL_REVIEWS = [
  ...BASE_REVIEWS,
  ...Array.from({ length: TOTAL_REVIEWS - BASE_REVIEWS.length }, (_, index) => ({
    name: `${REVIEW_NAMES[index % REVIEW_NAMES.length]} ${String.fromCharCode(65 + (index % 26))}.`,
    date: `${(index % 11) + 1} months ago`,
    rating: [4, 5, 5, 4, 5, 4][index % 6],
    comment: REVIEW_COMMENTS[index % REVIEW_COMMENTS.length]
  }))
];

// Dummy data for a single gym
const GYM_DATA = {
  id: 'gym-1',
  name: 'Ironbound Elite Fitness',
  location: 'Bandra West, Mumbai • 1.2 km',
  address: '21 Linking Road, Bandra West, Mumbai, Maharashtra 400050',
  monthlyPrice: 3499,
  trialFee: 99,
  availableTrialSlots: ['6:00 AM - 7:00 AM', '8:00 AM - 9:00 AM', '5:00 PM - 6:00 PM', '7:00 PM - 8:00 PM'],
  rating: 4.8,
  description:
    'Experience top-tier fitness at Ironbound Elite. We offer state-of-the-art equipment, dynamic group classes, and a supportive community to help you crush your goals regardless of your fitness level.',
  images: [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=600'
  ],
  facilities: [
    { name: 'Free Weights', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { name: 'Cardio Zone', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    {
      name: 'Group Classes',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
    },
    { name: 'Sauna', icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z' },
    { name: 'Personal Training', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
  ]
};

const GymProfile = () => {
  const { gymId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewDraft, setReviewDraft] = useState({ rating: 5, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [bookingDraft, setBookingDraft] = useState({
    slot: GYM_DATA.availableTrialSlots[0],
    visitDate: ''
  });
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Real app would fetch data based on gymId here. Using dummy data for MVP.
  const gym = gymId === '1' || gymId === 'gym-1' ? GYM_DATA : GYM_DATA;

  const visibleReviews = useMemo(() => reviews.slice(0, 25), [reviews]);

  const handleBookTrial = async (event) => {
    event.preventDefault();
    setBookingError('');
    setBookingMessage('');

    if (!user) {
      setBookingError('Please login or sign up first to book a trial slot.');
      return;
    }

    if (!bookingDraft.slot) {
      setBookingError('Please select a slot.');
      return;
    }

    if (!bookingDraft.visitDate) {
      setBookingError('Please select a preferred date.');
      return;
    }

    navigate(`/gyms/${gym.id}/trial-checkout`, {
      state: {
        gym,
        bookingDraft
      }
    });
  };

  const handleSubmitReview = (event) => {
    event.preventDefault();
    setReviewError('');

    if (!user) {
      setReviewError('Please login before posting a review.');
      return;
    }

    if (!reviewDraft.comment.trim()) {
      setReviewError('Please write your review before submitting.');
      return;
    }

    const author = user.displayName || user.email?.split('@')[0] || 'GymEase User';

    const newReview = {
      name: author,
      date: 'just now',
      rating: Number(reviewDraft.rating),
      comment: reviewDraft.comment.trim()
    };

    setReviews((prev) => [newReview, ...prev]);
    setReviewDraft({ rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  return (
    <div className="animate-fade-in pb-20">
      {/* Hero Images Grid - Sharp Edges */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-1 h-[60vh] mb-8 overflow-hidden bg-background">
        <div className="md:col-span-2 h-full relative group cursor-pointer">
          <img src={gym.images[0]} alt="Main" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
        </div>
        <div className="hidden md:block h-full relative group cursor-pointer">
          <img src={gym.images[1]} alt="Gallery 1" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
        </div>
        <div className="hidden md:block h-full relative group cursor-pointer">
          <img src={gym.images[2]} alt="Gallery 2" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
          <div className="absolute inset-0 bg-surface/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
            <span className="text-white font-medium">View All Photos</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <div className="flex-grow space-y-8">
          {/* Header Info */}
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter mb-4">{gym.name}</h1>
                <div className="flex flex-wrap items-center gap-6 text-white font-bold tracking-wide">
                  <span className="flex items-center gap-2 bg-surfaceLight px-4 py-2 border border-white/5">
                    <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold text-white">{gym.rating}</span>
                    <span className="uppercase">{reviews.length} REVIEWS</span>
                  </span>
                  <span className="flex items-center gap-2 bg-surfaceLight px-4 py-2 border border-white/5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="uppercase">{gym.location}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-white/10" />

          {/* About */}
          <section>
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tight mb-6">About</h2>
            <p className="text-lg text-textMuted leading-relaxed font-medium">{gym.description}</p>
          </section>

          {/* Facilities */}
          <section>
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tight mb-6">Facilities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gym.facilities.map((fac, i) => (
                <div key={i} className="flex flex-col items-center justify-center gap-4 bg-surface p-6 border border-white/5 group hover:border-primary transition-colors">
                  <div className="text-primary group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={fac.icon} />
                    </svg>
                  </div>
                  <span className="font-bold text-center uppercase tracking-wider text-sm group-hover:text-white transition-colors">{fac.name}</span>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-white/10 my-12" />

          {/* Reviews */}
          <section>
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {gym.rating} · {reviews.length} reviews
              </h2>
              <Button variant="outline" size="sm" onClick={() => setShowReviewForm((prev) => !prev)}>
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </Button>
            </div>

            {showReviewForm && (
              <Card className="p-5 mb-6">
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-textMuted mb-2">Rating</label>
                    <select
                      className="input-field"
                      value={reviewDraft.rating}
                      onChange={(e) => setReviewDraft((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                    >
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Very Good</option>
                      <option value="3">3 - Good</option>
                      <option value="2">2 - Fair</option>
                      <option value="1">1 - Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-textMuted mb-2">Your Review</label>
                    <textarea
                      className="input-field min-h-28 resize-y"
                      placeholder="Share your honest experience..."
                      value={reviewDraft.comment}
                      onChange={(e) => setReviewDraft((prev) => ({ ...prev, comment: e.target.value }))}
                    />
                  </div>
                  {reviewError && <p className="text-sm text-red-400">{reviewError}</p>}
                  <Button type="submit">Post Review</Button>
                </form>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {visibleReviews.map((rev, i) => (
                <ReviewCard key={`${rev.name}-${rev.date}-${i}`} {...rev} />
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-textMuted">Showing latest 25 reviews.</p>
            </div>
          </section>
        </div>

        {/* Sticky Sidebar / Pricing Card */}
        <div className="w-full lg:w-96 flex-shrink-0 mt-8 lg:mt-0">
          <Card className="sticky top-20 p-8 border-4 border-surface bg-background">
            <div className="mb-8 pb-8 border-b border-white/10">
              <span className="text-5xl font-black text-white">{formatINR(gym.monthlyPrice)}</span>
              <span className="text-textMuted font-bold uppercase tracking-widest ml-2">/ month</span>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <div>
                  <h4 className="font-black text-white uppercase tracking-wider mb-1">Location</h4>
                  <p className="text-sm font-medium text-textMuted">{gym.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-black text-white uppercase tracking-wider mb-1">Hours</h4>
                  <p className="text-sm font-medium text-textMuted">Open 24/7</p>
                </div>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleBookTrial}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-textMuted mb-2">Trial Fee</label>
                <div className="rounded-xl border border-white/10 bg-surfaceLight/60 px-4 py-3 text-white font-bold">
                  One-time fee: {formatINR(gym.trialFee)}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-textMuted mb-2">Select Trial Slot</label>
                <select
                  className="input-field"
                  value={bookingDraft.slot}
                  onChange={(e) => setBookingDraft((prev) => ({ ...prev, slot: e.target.value }))}
                >
                  {gym.availableTrialSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Preferred Date"
                type="date"
                value={bookingDraft.visitDate}
                onChange={(e) => setBookingDraft((prev) => ({ ...prev, visitDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
              />

              {bookingError && <p className="text-center text-xs text-red-400">{bookingError}</p>}
              {bookingMessage && <p className="text-center text-xs text-primary">{bookingMessage}</p>}

              <Button
                size="lg"
                type="submit"
                className="w-full py-5 text-lg shadow-[4px_4px_0px_white] hover:translate-y-1 hover:shadow-[2px_2px_0px_white] transition-all"
                disabled={bookingLoading}
              >
                {bookingLoading ? 'Processing...' : 'Book Trial Slot'}
              </Button>
            </form>

            <p className="text-center font-bold text-xs uppercase tracking-widest text-textMuted mt-6">Pay once to reserve your first trial</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GymProfile;
