'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const pocPages = [
  { 
    href: '/poc/sam2', 
    label: 'SAM2 Vision', 
    color: 'bg-basil',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )
  },
  { 
    href: '/poc/llama', 
    label: 'Llama AI', 
    color: 'bg-golden',
    icon: '🦙'
  },
  { 
    href: '/poc/vjepa', 
    label: 'V-JEPA 2', 
    color: 'bg-tomato',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  { 
    href: '/poc/voice', 
    label: 'Voice Control', 
    color: 'bg-orange-500',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    )
  },
  { 
    href: '/demo', 
    label: 'Full Demo', 
    color: 'bg-gradient-to-r from-herb-green to-golden',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    )
  }
];

export default function POCNavigation() {
  const pathname = usePathname();

  return (
    <section className="py-12 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Explore All Demos</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {pocPages.map((poc) => {
            const isActive = pathname === poc.href;
            return (
              <Link
                key={poc.href}
                href={poc.href}
                className={`group relative overflow-hidden rounded-lg border-2 transition-all ${
                  isActive 
                    ? 'border-herb-green bg-herb-green/5' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="p-6 text-center">
                  <div className={`w-12 h-12 ${poc.color} rounded-full flex items-center justify-center mx-auto mb-3 text-white group-hover:scale-110 transition-transform`}>
                    {typeof poc.icon === 'string' ? (
                      <span className="text-2xl">{poc.icon}</span>
                    ) : (
                      poc.icon
                    )}
                  </div>
                  <h3 className={`font-semibold ${isActive ? 'text-herb-green' : 'text-gray-900'}`}>
                    {poc.label}
                  </h3>
                  {isActive && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-herb-green rounded-full"></span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}