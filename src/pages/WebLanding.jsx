import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function WebLanding() {
  const navigate = useNavigate();

  return (
    <div className="font-sans bg-[#f8f8f5] text-[#1a1a1a] overflow-x-hidden pb-10">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md py-4 z-50 border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#f4e225] to-[#dcb808] rounded-xl flex items-center justify-center text-2xl shadow-sm">
              🛺
            </div>
            <span className="text-2xl font-extrabold text-[#1a1a1a] tracking-tight">
              Auto Bhaiya
            </span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#features" className="text-[#1a1a1a] font-semibold text-sm hover:text-[#15803d] transition-colors">
              Features
            </a>
            <a href="#safety" className="text-[#1a1a1a] font-semibold text-sm hover:text-[#15803d] transition-colors">
              Safety
            </a>
            <a href="#pricing" className="text-[#1a1a1a] font-semibold text-sm hover:text-[#15803d] transition-colors">
              Pricing
            </a>
            <button 
              onClick={() => navigate('/app')}
              className="bg-[#15803d] hover:bg-[#166534] text-white px-6 py-2.5 rounded-full font-bold text-sm transition-colors shadow-md shadow-green-900/20"
            >
              Open Web App
            </button>
          </div>
          <div className="md:hidden">
            <button 
              onClick={() => navigate('/app')}
              className="bg-[#15803d] hover:bg-[#166534] text-white px-4 py-2 rounded-full font-bold text-xs transition-colors shadow-md"
            >
              Open App
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-[140px] pb-20 px-6 bg-gradient-to-br from-[#f4e225] to-[#15803d] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z" fill="%23000000" fill-opacity="1" fill-rule="evenodd"/%3E%3C/svg%3E')`
        }}></div>
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="inline-flex bg-white/30 border-2 border-white/50 px-5 py-2 rounded-full mb-6 backdrop-blur-md items-center gap-2">
              <ShieldCheck size={16} className="text-[#1a1a1a]" />
              <span className="font-bold text-sm text-[#1a1a1a]">TRUSTED BY 10,000+ PARENTS</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] mb-6 text-[#1a1a1a]">
              Safe School Rides, <span className="text-white drop-shadow-md">Every Day</span>
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-black/80 mb-10 font-medium max-w-lg">
              Book verified auto drivers for your child's daily school commute. Real-time tracking, background-checked drivers, and peace of mind guaranteed.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate('/app')} className="bg-[#1a1a1a] hover:bg-black text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_10px_40px_rgba(0,0,0,0.2)] transition-transform active:scale-95">
                Go to App
              </button>
              <button className="bg-white hover:bg-gray-50 text-[#1a1a1a] border-2 border-[#1a1a1a] px-8 py-4 rounded-full font-bold text-lg transition-transform active:scale-95 flex items-center gap-2">
                Watch Demo <span>📹</span>
              </button>
            </div>
            
            <div className="flex gap-10 mt-12 bg-white/20 p-6 rounded-3xl backdrop-blur-sm border border-white/30 inline-flex">
              <div>
                <div className="text-3xl font-black text-[#1a1a1a]">4.9★</div>
                <div className="text-sm text-black/70 font-bold mt-1">App Rating</div>
              </div>
              <div>
                <div className="text-3xl font-black text-[#1a1a1a]">50K+</div>
                <div className="text-sm text-black/70 font-bold mt-1">Safe Rides</div>
              </div>
              <div>
                <div className="text-3xl font-black text-[#1a1a1a]">500+</div>
                <div className="text-sm text-black/70 font-bold mt-1">Schools</div>
              </div>
            </div>
          </div>
          
          <div className="relative hidden md:block">
            <div className="bg-white rounded-[32px] p-10 shadow-[0_30px_80px_rgba(0,0,0,0.15)] rotate-2 transform hover:rotate-0 transition-all duration-500 max-w-md mx-auto">
              <div className="bg-[#f4e225] h-2 rounded-full mb-6 w-1/3"></div>
              <div className="text-[140px] text-center my-5 leading-none animate-bounce">🛺</div>
              <div className="text-center text-xl font-bold mt-8 text-[#1a1a1a]">Track Your Child Live</div>
              <div className="h-16 bg-gray-100 rounded-xl mt-4 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-white shrink-0">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block bg-[#f4e225] px-6 py-2 rounded-full mb-4">
            <span className="font-bold text-sm text-[#1a1a1a] tracking-wide">✨ WHY CHOOSE US</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#1a1a1a]">Everything Parents Need</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-16 font-medium">
            Designed with safety, reliability, and convenience in mind.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {[
              { icon: '🛡️', title: 'Verified Drivers', desc: 'Background-checked, trained drivers with 4.5+ ratings. Police verification mandatory.', color: 'from-[#15803d] to-[#22c55e]' },
              { icon: '📍', title: 'Live Tracking', desc: 'Real-time GPS tracking. Know exactly where your child is at all times.', color: 'from-[#f4e225] to-[#dcb808]' },
              { icon: '🔔', title: 'Smart Alerts', desc: 'Instant notifications for pickup, drop-off, and any route deviations.', color: 'from-blue-500 to-blue-600' },
              { icon: '💬', title: 'Direct Communication', desc: 'In-app chat with drivers. No need to share personal phone numbers.', color: 'from-purple-500 to-purple-600' },
              { icon: '⏰', title: 'Flexible Scheduling', desc: 'Book daily, weekly, or monthly. Cancel or reschedule anytime.', color: 'from-pink-500 to-pink-600' },
              { icon: '💰', title: 'Transparent Pricing', desc: 'No surge pricing. Fixed monthly rates. UPI, cards, and cash accepted.', color: 'from-orange-500 to-orange-600' }
            ].map((f, i) => (
              <div key={i} className="bg-[#f8f8f5] p-8 rounded-3xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`w-16 h-16 bg-gradient-to-br ${f.color} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-md`}>
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-[#1a1a1a]">{f.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section id="safety" className="py-24 px-6 bg-gradient-to-br from-[#15803d] to-[#166534]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block bg-white/20 px-6 py-2 rounded-full mb-4 backdrop-blur-md">
              <span className="font-bold text-sm text-white tracking-wide">🛡️ SAFETY FIRST</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white leading-tight">Your Child's Safety is Our Priority</h2>
            <p className="text-lg text-white/90 leading-relaxed mb-10 font-medium">We go above and beyond industry standards to ensure every ride is safe, secure, and supervised.</p>
            
            <div className="flex flex-col gap-6">
              {[
                { title: 'Police Verification', desc: 'Every driver undergoes thorough police background checks and document verification.' },
                { title: 'Vehicle Safety Checks', desc: 'Monthly vehicle inspections, valid insurance, and emission certificates required.' },
                { title: '24/7 Support Team', desc: 'Dedicated support team available round the clock for emergencies.' },
                { title: 'SOS Emergency Button', desc: 'One-tap emergency alert that notifies parents and our support team instantly.' }
              ].map((s, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl shrink-0">✅</div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">{s.title}</h4>
                    <p className="text-white/80 font-medium">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-[40px] p-12 text-center shadow-[0_30px_80px_rgba(0,0,0,0.3)] transform transition-transform hover:scale-[1.02]">
              <div className="text-[100px] leading-none mb-6 animate-pulse">🛡️</div>
              <h3 className="text-3xl font-extrabold text-[#1a1a1a] mb-8">100% Safe Rides</h3>
              <div className="bg-[#f4e225] h-2 w-24 mx-auto rounded-full mb-8"></div>
              <div className="flex justify-between md:justify-around text-center border-t border-gray-100 pt-8">
                <div>
                  <div className="text-4xl font-black text-[#15803d]">0</div>
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mt-2">Incidents</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-[#15803d]">100%</div>
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mt-2">Verified</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-[#15803d]">24/7</div>
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-wide mt-2">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block bg-[#f4e225] px-6 py-2 rounded-full mb-4">
            <span className="font-bold text-sm text-[#1a1a1a] tracking-wide">💰 SIMPLE PRICING</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#1a1a1a]">Affordable Plans for Every Family</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-16 font-medium">No hidden charges. Cancel anytime. First ride free!</p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left items-center">
            {/* Daily */}
            <div className="bg-[#f8f8f5] p-10 rounded-[32px] border-2 border-transparent hover:border-gray-200 transition-all">
              <div className="text-lg font-bold text-gray-500 mb-4 tracking-wide">DAILY</div>
              <div className="text-5xl font-black text-[#1a1a1a] mb-2">₹80<span className="text-xl text-gray-500 font-bold">/day</span></div>
              <p className="text-gray-600 font-medium mb-8">Perfect for occasional rides</p>
              <div className="space-y-4 mb-8">
                {['Pay per ride', 'Live tracking', 'Safety features', '24/7 support'].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 font-semibold text-gray-800">
                    <span className="text-[#15803d] font-bold">✓</span> {f}
                  </div>
                ))}
              </div>
              <button className="w-full bg-white text-[#1a1a1a] border-2 border-[#1a1a1a] py-4 rounded-full font-bold hover:bg-gray-50 transition-colors">Choose Plan</button>
            </div>

            {/* Monthly - Highlighted */}
            <div className="bg-gradient-to-br from-[#f4e225] to-[#dcb808] p-10 rounded-[32px] border-2 border-[#dcb808] shadow-[0_20px_60px_rgba(244,226,37,0.3)] transform md:scale-105 relative z-10">
              <div className="absolute -top-4 right-8 bg-[#15803d] text-white px-4 py-1.5 rounded-full text-xs font-black tracking-widest shadow-md">POPULAR</div>
              <div className="text-lg font-bold text-black/70 mb-4 tracking-wide">MONTHLY</div>
              <div className="text-5xl font-black text-[#1a1a1a] mb-2">₹1,500<span className="text-xl text-black/60 font-bold">/mo</span></div>
              <p className="text-black/80 font-bold mb-8">Most popular choice</p>
              <div className="space-y-4 mb-8">
                {[<span key={1} className="font-bold text-black">Unlimited rides</span>, 'Priority support', 'Same driver daily', 'Save ₹500/month'].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 font-semibold text-gray-900">
                    <span className="text-[#15803d] font-black">✓</span> {f}
                  </div>
                ))}
              </div>
              <button className="w-full bg-[#1a1a1a] text-white py-4 rounded-full font-bold shadow-lg hover:bg-black transition-colors">Choose Plan</button>
            </div>

            {/* Annual */}
            <div className="bg-[#f8f8f5] p-10 rounded-[32px] border-2 border-transparent hover:border-gray-200 transition-all">
              <div className="text-lg font-bold text-gray-500 mb-4 tracking-wide">ANNUAL</div>
              <div className="text-5xl font-black text-[#1a1a1a] mb-2">₹15k<span className="text-xl text-gray-500 font-bold">/yr</span></div>
              <p className="text-gray-600 font-medium mb-8">Best value for money</p>
              <div className="space-y-4 mb-8">
                {[<span key={1} className="font-bold text-gray-900">Everything in Monthly</span>, 'Save ₹3,000/year', 'Free backup driver', 'Premium support'].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 font-semibold text-gray-800">
                    <span className="text-[#15803d] font-bold">✓</span> {f}
                  </div>
                ))}
              </div>
              <button className="w-full bg-white text-[#1a1a1a] border-2 border-[#1a1a1a] py-4 rounded-full font-bold hover:bg-gray-50 transition-colors">Choose Plan</button>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-[#1a1a1a] text-white py-12 px-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-[#f4e225] to-[#dcb808] rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm">
          🛺
        </div>
        <h3 className="text-2xl font-bold mb-6">Auto Bhaiya</h3>
        <p className="text-gray-400 font-medium max-w-md mx-auto mb-8">Providing safe, reliable, and verified auto rides for school children.</p>
        <button onClick={() => navigate('/app')} className="bg-[#15803d] hover:bg-[#166534] text-white px-8 py-3 rounded-full font-bold transition-colors">
          Open Web App
        </button>
        <div className="mt-12 text-sm text-gray-500 font-semibold">
          © {new Date().getFullYear()} Auto Bhaiya. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
