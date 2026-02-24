"use client";

// Note: Metadata for this page is handled in a separate metadata.ts file
// since this is a client component

import { useState, useEffect } from 'react';
import { ChevronRight, Star, Loader2, ImageIcon } from 'lucide-react';
import BeforeAfterSlider from '../../components/BeforeAfterSlider';

interface BeforeAfter {
  _id: string;
  beforeImage: string;
  afterImage: string;
  treatment: string;
  createdAt: string;
}

export default function GalleryPage() {
  const [beforeAfters, setBeforeAfters] = useState<BeforeAfter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTreatment, setSelectedTreatment] = useState<string>('all');

  useEffect(() => {
    fetchBeforeAfters();
  }, []);

  const fetchBeforeAfters = async () => {
    try {
      const response = await fetch('/api/before-after?limit=50');
      const data = await response.json();
      
      if (data.success) {
        setBeforeAfters(data.data.beforeAfters);
      } else {
        setError('Failed to load gallery');
      }
    } catch (err) {
      setError('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const treatments = ['all', ...new Set(beforeAfters.map(item => item.treatment))];
  const filteredCases = selectedTreatment === 'all' 
    ? beforeAfters 
    : beforeAfters.filter(item => item.treatment === selectedTreatment);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F7FBFE] to-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#2FA4C5] animate-spin" />
          <span className="text-lg text-[#5E6E7E]">Loading gallery...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F7FBFE] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠</span>
          </div>
          <h2 className="text-xl font-semibold text-[#0F2A3B] mb-2">Oops! Something went wrong</h2>
          <p className="text-[#5E6E7E]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F2A3B]/5 to-[#2FA4C5]/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#E6EEF3] rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-[#2FA4C5]" />
            <span className="text-sm font-medium text-[#0F2A3B]">Transformation Gallery</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F2A3B] mb-6">
            Amazing <span className="text-[#2FA4C5]">Smile</span> Transformations
          </h1>
          
          <p className="text-lg md:text-xl text-[#5E6E7E] max-w-3xl mx-auto mb-8">
            Witness the incredible journey of our patients' smile makeovers. 
            Real results from real people who trusted us with their dental care.
          </p>
        
        </div>
      </section>


      {/* Gallery Grid */}
      <section className="py-28" style={{ background: "var(--white)", borderTop: "1px solid var(--border-light)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCases.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-[#F7FBFE] rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-[#5E6E7E]" />
              </div>
              <h3 className="text-lg font-medium text-[#0F2A3B] mb-2">No results found</h3>
              <p className="text-[#5E6E7E]">Try selecting a different treatment category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {filteredCases.map((item, index) => (
                <div 
                  key={item._id} 
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  <BeforeAfterSlider
                    before={item.beforeImage}
                    after={item.afterImage}
                    treatment={item.treatment}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>


      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}