import React, { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/common/ui/Button';
import Card from '../../components/common/ui/Card';
import { formatINR } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import bookingService from '../../services/bookingService';

const TrialCheckout = () => {
  const { gymId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const gym = location.state?.gym;
  const bookingDraft = location.state?.bookingDraft;

  const [paymentStep, setPaymentStep] = useState('idle');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleMockPaymentAndBook = async () => {
    setError('');
    setSuccess('');

    if (!user) {
      setError('Please login to continue checkout.');
      return;
    }

    if (!gym || !bookingDraft?.slot) {
      setError('Invalid checkout session. Please start from the gym page.');
      return;
    }

    setPaymentStep('processing');

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));

      const booking = await bookingService.createTrialBooking({
        gymId: gym.id,
        userEmail: user.email,
        userName: user.displayName || user.email?.split('@')[0] || 'GymEase User',
        slot: bookingDraft.slot,
        visitDate: bookingDraft.visitDate
      });

      setPaymentStep('done');
      setSuccess(
        `Payment placeholder successful. Trial confirmed for ${booking.slot} on ${booking.visitDate || 'selected date'} (${formatINR(booking.feeAmount)}).`
      );
    } catch (err) {
      setPaymentStep('idle');
      setError(err.message || 'Unable to process booking.');
    }
  };

  if (!gym || !bookingDraft) {
    return (
      <div className="max-w-3xl mx-auto py-10">
        <Card className="p-8">
          <h1 className="text-2xl font-black text-white mb-3">Trial Checkout</h1>
          <p className="text-textMuted mb-6">No trial session selected yet.</p>
          <Link to={`/gyms/${gymId || 'gym-1'}`}>
            <Button>Back to Gym</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-10 animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tight mb-6">Trial Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-black text-white mb-4">Booking Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-textMuted">Gym</span>
              <span className="text-white font-semibold">{gym.name}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-textMuted">Location</span>
              <span className="text-white font-semibold">{gym.location}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-textMuted">Slot</span>
              <span className="text-white font-semibold">{bookingDraft.slot}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-textMuted">Date</span>
              <span className="text-white font-semibold">{bookingDraft.visitDate}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-textMuted">User</span>
              <span className="text-white font-semibold">{user?.email || 'Not logged in'}</span>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-xs text-yellow-200">
            This is a payment placeholder page. Real payment gateway integration (Razorpay/Stripe) can be added here later.
          </div>

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
          {success && <p className="mt-4 text-sm text-primary">{success}</p>}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-black text-white mb-4 uppercase">Amount</h3>
          <p className="text-textMuted text-sm">One-time trial fee</p>
          <p className="text-4xl font-black text-white mt-2 mb-6">{formatINR(gym.trialFee)}</p>

          <Button
            className="w-full"
            onClick={handleMockPaymentAndBook}
            disabled={paymentStep === 'processing' || paymentStep === 'done'}
          >
            {paymentStep === 'processing' ? 'Processing Payment...' : paymentStep === 'done' ? 'Payment Complete' : `Pay ${formatINR(gym.trialFee)} & Confirm`}
          </Button>

          <button
            className="w-full mt-3 text-sm text-textMuted hover:text-white"
            onClick={() => navigate(`/gyms/${gym.id}`)}
            type="button"
          >
            Back to gym page
          </button>
        </Card>
      </div>
    </div>
  );
};

export default TrialCheckout;
