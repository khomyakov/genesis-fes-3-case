import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSearch } from '@tanstack/react-router';
import type { Track } from '../types';
import { TrackRow } from './TrackRow';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  tracks: Track[];
  isLoading?: boolean;
}

// Animation variants
const listVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.07,
      delayChildren: 0.1
    } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const TrackList = ({ tracks, isLoading = false }: Props) => {
  const [visibleTracks, setVisibleTracks] = useState(tracks);
  const { page } = useSearch({ from: '/tracks' });
  
  // Track page changes to trigger animations
  useEffect(() => {
    // Small delay to make animations feel more natural
    const timer = setTimeout(() => {
      setVisibleTracks(tracks);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [tracks, page]);

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-0">
        <motion.ul 
          className="divide-y divide-gray-200 dark:divide-gray-800"
          variants={listVariants}
          initial="hidden"
          animate="visible"
          key={`track-list-${page}`}
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                data-testid="loading-indicator"
                className="py-8 flex justify-center items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="animate-pulse space-y-4 w-full px-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-16 bg-muted rounded-md" />
                  ))}
                </div>
              </motion.div>
            ) : (
              visibleTracks.map((track) => (
                <motion.div
                  key={track.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ 
                    duration: 0.3, 
                    ease: "easeOut" 
                  }}
                  layout
                >
                  <TrackRow track={track} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.ul>
      </CardContent>
    </Card>
  );
};
