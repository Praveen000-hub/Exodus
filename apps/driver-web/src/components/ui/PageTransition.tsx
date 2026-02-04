'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousPath, setPreviousPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== previousPath) {
      setIsTransitioning(true);
      setPreviousPath(pathname);
      
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [pathname, previousPath]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            key="transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-white via-orange-50 to-white"
          >
            <div className="relative">
              {/* Animated Car */}
              <motion.div
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.8, 
                  ease: "easeOut",
                  delay: 0.2
                }}
                className="relative"
              >
                <div className="text-8xl">🚚</div>
                
                {/* Speed Lines */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: [0, 1, 0], x: [-20, -60] }}
                  transition={{ 
                    duration: 0.6, 
                    repeat: Infinity,
                    repeatDelay: 0.1
                  }}
                  className="absolute top-1/2 -left-20 transform -translate-y-1/2"
                >
                  <div className="flex gap-2">
                    <div className="w-8 h-1 bg-orange-400 rounded-full"></div>
                    <div className="w-6 h-1 bg-orange-300 rounded-full"></div>
                    <div className="w-4 h-1 bg-orange-200 rounded-full"></div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Loading Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-8 text-center"
              >
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  Loading...
                </div>
                <div className="flex items-center justify-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1, 0] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                      className="w-2 h-2 bg-orange-500 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>

              {/* Road Animation */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-64 h-2 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full origin-left"
              >
                <div className="absolute inset-0 flex items-center justify-around">
                  <motion.div
                    animate={{ x: [-100, 100] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-0.5 bg-white rounded-full"
                  />
                </div>
              </motion.div>
            </div>

            {/* Background Elements */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute top-20 right-20 w-32 h-32 bg-orange-500 rounded-full blur-3xl"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute bottom-20 left-20 w-40 h-40 bg-orange-400 rounded-full blur-3xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    </>
  );
}
