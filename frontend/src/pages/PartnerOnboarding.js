import React, { useEffect, useMemo, useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { SERVICE_CATEGORIES } from '../data/gymsData';

const STORAGE_KEY = 'gymease_partner_leads';

const PartnerOnboarding = () => {
  const [activeTab, setActiveTab] = useState('gym');
  const [message, setMessage] = useState('');
  const [leads, setLeads] = useState([]);

  const [gymForm, setGymForm] = useState({
    gymName: '',
    ownerName: '',
    email: '',
    city: '',
    liteMonthly: '',
    primeMonthly: '',
    platinumMonthly: '',
    dayPass: ''
  });

  const [trainerForm, setTrainerForm] = useState({
    name: '',
    email: '',
    city: '',
    speciality: SERVICE_CATEGORIES[0],
    pricingType: 'Monthly',
    price: '',
    bio: ''
  });

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      setLeads(JSON.parse(raw));
    }
  }, []);

  const saveLead = (payload) => {
    const next = [{ ...payload, id: Date.now() }, ...leads];
    setLeads(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const recentGyms = useMemo(() => leads.filter((l) => l.type === 'gym').slice(0, 5), [leads]);
  const recentTrainers = useMemo(() => leads.filter((l) => l.type === 'trainer').slice(0, 5), [leads]);

  const submitGymLead = (e) => {
    e.preventDefault();
    setMessage('');

    if (!gymForm.gymName || !gymForm.email || !gymForm.city) {
      setMessage('Please fill gym name, city, and email.');
      return;
    }

    saveLead({
      type: 'gym',
      title: gymForm.gymName,
      subtitle: `${gymForm.city} · ${gymForm.email}`,
      details: `${gymForm.ownerName || 'Owner'} | Lite ₹${gymForm.liteMonthly || '-'} Prime ₹${gymForm.primeMonthly || '-'} Platinum ₹${gymForm.platinumMonthly || '-'} Day ₹${gymForm.dayPass || '-'}`
    });

    setGymForm({
      gymName: '',
      ownerName: '',
      email: '',
      city: '',
      liteMonthly: '',
      primeMonthly: '',
      platinumMonthly: '',
      dayPass: ''
    });

    setMessage('Gym onboarding request submitted successfully.');
  };

  const submitTrainerLead = (e) => {
    e.preventDefault();
    setMessage('');

    if (!trainerForm.name || !trainerForm.email || !trainerForm.city || !trainerForm.price) {
      setMessage('Please complete trainer name, city, email and pricing.');
      return;
    }

    saveLead({
      type: 'trainer',
      title: trainerForm.name,
      subtitle: `${trainerForm.speciality} · ${trainerForm.city}`,
      details: `${trainerForm.pricingType}: ₹${trainerForm.price} | ${trainerForm.email}`
    });

    setTrainerForm({
      name: '',
      email: '',
      city: '',
      speciality: SERVICE_CATEGORIES[0],
      pricingType: 'Monthly',
      price: '',
      bio: ''
    });

    setMessage('Trainer/health coach onboarding request submitted successfully.');
  };

  return (
    <div className="animate-fade-in space-y-8 pb-16">
      <header className="space-y-3">
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tight">Partner With Us</h1>
        <p className="text-textMuted max-w-3xl">
          Onboard your gym or trainer profile on GymEase. Configure personalized pricing (monthly/day-wise) and list your services for users.
        </p>
      </header>

      <div className="flex gap-2 flex-wrap">
        <Button variant={activeTab === 'gym' ? 'primary' : 'secondary'} size="sm" onClick={() => setActiveTab('gym')}>
          Gym Onboarding
        </Button>
        <Button variant={activeTab === 'trainer' ? 'primary' : 'secondary'} size="sm" onClick={() => setActiveTab('trainer')}>
          Trainer & Health Coach Onboarding
        </Button>
      </div>

      {message && (
        <Card className="p-4 border border-primary/50">
          <p className="text-primary text-sm font-semibold">{message}</p>
        </Card>
      )}

      {activeTab === 'gym' ? (
        <Card className="p-6">
          <h2 className="text-2xl font-black text-white uppercase italic mb-6">Gym Listing Form</h2>
          <form className="grid md:grid-cols-2 gap-4" onSubmit={submitGymLead}>
            <Input label="Gym Name" value={gymForm.gymName} onChange={(e) => setGymForm((p) => ({ ...p, gymName: e.target.value }))} />
            <Input label="Owner Name" value={gymForm.ownerName} onChange={(e) => setGymForm((p) => ({ ...p, ownerName: e.target.value }))} />
            <Input label="Email" type="email" value={gymForm.email} onChange={(e) => setGymForm((p) => ({ ...p, email: e.target.value }))} />
            <Input label="City" value={gymForm.city} onChange={(e) => setGymForm((p) => ({ ...p, city: e.target.value }))} />
            <Input label="Lite Monthly (₹)" type="number" value={gymForm.liteMonthly} onChange={(e) => setGymForm((p) => ({ ...p, liteMonthly: e.target.value }))} />
            <Input label="Prime Monthly (₹)" type="number" value={gymForm.primeMonthly} onChange={(e) => setGymForm((p) => ({ ...p, primeMonthly: e.target.value }))} />
            <Input label="Platinum Monthly (₹)" type="number" value={gymForm.platinumMonthly} onChange={(e) => setGymForm((p) => ({ ...p, platinumMonthly: e.target.value }))} />
            <Input label="Day Pass (₹)" type="number" value={gymForm.dayPass} onChange={(e) => setGymForm((p) => ({ ...p, dayPass: e.target.value }))} />
            <div className="md:col-span-2">
              <Button type="submit">Submit Gym Listing</Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card className="p-6">
          <h2 className="text-2xl font-black text-white uppercase italic mb-6">Trainer / Health Coach Listing</h2>
          <form className="grid md:grid-cols-2 gap-4" onSubmit={submitTrainerLead}>
            <Input label="Name" value={trainerForm.name} onChange={(e) => setTrainerForm((p) => ({ ...p, name: e.target.value }))} />
            <Input label="Email" type="email" value={trainerForm.email} onChange={(e) => setTrainerForm((p) => ({ ...p, email: e.target.value }))} />
            <Input label="City" value={trainerForm.city} onChange={(e) => setTrainerForm((p) => ({ ...p, city: e.target.value }))} />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-textMain ml-1">Service Category</label>
              <select className="input-field" value={trainerForm.speciality} onChange={(e) => setTrainerForm((p) => ({ ...p, speciality: e.target.value }))}>
                {SERVICE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-textMain ml-1">Pricing Type</label>
              <select className="input-field" value={trainerForm.pricingType} onChange={(e) => setTrainerForm((p) => ({ ...p, pricingType: e.target.value }))}>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <Input label="Price (₹)" type="number" value={trainerForm.price} onChange={(e) => setTrainerForm((p) => ({ ...p, price: e.target.value }))} />
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-medium text-textMain ml-1">Bio</label>
              <textarea className="input-field min-h-24" value={trainerForm.bio} onChange={(e) => setTrainerForm((p) => ({ ...p, bio: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <Button type="submit">Submit Trainer Listing</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="text-lg text-white font-black mb-4 uppercase">Recent Gym Onboardings</h3>
          <div className="space-y-3">
            {recentGyms.length ? (
              recentGyms.map((item) => (
                <div key={item.id} className="border border-white/10 rounded-lg p-3">
                  <p className="text-white font-semibold">{item.title}</p>
                  <p className="text-textMuted text-xs">{item.subtitle}</p>
                  <p className="text-textMuted text-xs mt-1">{item.details}</p>
                </div>
              ))
            ) : (
              <p className="text-textMuted text-sm">No gym onboarding submissions yet.</p>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-lg text-white font-black mb-4 uppercase">Recent Trainer Onboardings</h3>
          <div className="space-y-3">
            {recentTrainers.length ? (
              recentTrainers.map((item) => (
                <div key={item.id} className="border border-white/10 rounded-lg p-3">
                  <p className="text-white font-semibold">{item.title}</p>
                  <p className="text-textMuted text-xs">{item.subtitle}</p>
                  <p className="text-textMuted text-xs mt-1">{item.details}</p>
                </div>
              ))
            ) : (
              <p className="text-textMuted text-sm">No trainer onboarding submissions yet.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PartnerOnboarding;
