'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './LoadingOverlay.module.css';

const spinnerVariants = {
  spin: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: 'linear',
    },
  },
};

const LoadingOverlay: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  return (
    <motion.div
      className={styles.loadingOverlay}
      initial={{ opacity: 0, zIndex: -1 }}
      animate={isLoading && { opacity: 1, zIndex: 1000 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={styles.spinner}
        variants={spinnerVariants}
        animate="spin"
      />
    </motion.div>
  );
};

export default LoadingOverlay;
