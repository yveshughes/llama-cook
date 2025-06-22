'use client';

import { motion } from 'framer-motion';

export default function SAM2Feature() {
  return (
    <section className="py-24 sm:py-32 bg-cream/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center rounded-full bg-basil/10 px-4 py-2 text-sm font-medium text-basil mb-4">
              Step 3: Vision Tracking
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              SAM2 keeps watch of ingredients and their state
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Real-time tracking ensures nothing is overlooked during preparation
            </p>
          </motion.div>
        </div>

        {/* Video container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="relative w-full max-w-5xl">
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/videos/Final1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}