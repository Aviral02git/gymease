import React from 'react';
import Input from '../../components/common/ui/Input';
import Button from '../../components/common/ui/Button';
import Card from '../../components/common/ui/Card';

const Contact = () => {
  return (
    <div className="animate-fade-in animate-slide-up max-w-4xl mx-auto py-12">
      
      {/* Header */}
      <div className="text-left mb-16 border-l-8 border-primary pl-6">
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter mb-4">Get in Touch</h1>
        <p className="text-xl font-medium text-textMuted max-w-2xl">
          Have a question about GymEase? Interested in partnering with us? 
          Drop us a message.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-12">
        
        {/* Contact Information Cards */}
        <div className="md:col-span-2 space-y-4">
          <Card className="p-8 border-t-2 border-t-primary bg-surface flex flex-col gap-4">
            <div className="w-12 h-12 bg-surfaceLight flex items-center justify-center text-primary">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
               </svg>
            </div>
            <div>
              <h3 className="font-black uppercase tracking-widest text-white mb-2">Comms</h3>
              <p className="font-medium text-textMuted">support@gymease.com</p>
              <p className="font-medium text-textMuted">partnerships@gymease.com</p>
            </div>
          </Card>

          <Card className="p-8 border-t-2 border-t-primary bg-surface flex flex-col gap-4">
            <div className="w-12 h-12 bg-surfaceLight flex items-center justify-center text-primary">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
            </div>
            <div>
              <h3 className="font-black uppercase tracking-widest text-white mb-2">HQ</h3>
              <p className="font-medium text-textMuted">123 Fitness Way, Suite 400</p>
              <p className="font-medium text-textMuted">San Francisco, CA 94105</p>
            </div>
          </Card>

          <Card className="p-8 border-t-2 border-t-primary bg-surface flex flex-col gap-4">
             <div className="w-12 h-12 bg-surfaceLight flex items-center justify-center text-primary">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
               </svg>
            </div>
            <div>
              <h3 className="font-black uppercase tracking-widest text-white mb-2">Call</h3>
              <p className="font-medium text-textMuted">+1 (555) 123-4567</p>
              <p className="font-medium text-textMuted uppercase text-xs mt-1">Mon-Fri 8am-5pm</p>
            </div>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-3">
          <Card className="p-10 bg-surface">
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tight mb-8">Send a Message</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input 
                  label="First Name" 
                  placeholder="John" 
                  autoComplete="given-name" 
                />
                <Input 
                  label="Last Name" 
                  placeholder="Doe" 
                  autoComplete="family-name" 
                />
              </div>
              
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="john@example.com" 
                autoComplete="email" 
              />
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-textMuted uppercase tracking-widest ml-1">Topic</label>
                <select className="input-field bg-surfaceLight">
                  <option>General Inquiry</option>
                  <option>Gym Partnership</option>
                  <option>Support & Billing</option>
                  <option>Feedback</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-textMuted uppercase tracking-widest ml-1">Message</label>
                <textarea 
                  rows="5" 
                  className="input-field resize-none bg-surfaceLight"
                  placeholder="How can we help you today?"
                ></textarea>
              </div>

              <Button size="lg" type="submit" className="w-full mt-4">
                Shoot Message
              </Button>
            </form>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Contact;
