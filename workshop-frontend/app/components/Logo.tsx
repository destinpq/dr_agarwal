"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Logo = () => {
  return (
    <div style={{ 
      textAlign: 'center', 
      marginBottom: '2.5rem',
      marginTop: '1.5rem',
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      padding: '0.5rem'
    }}>
      <motion.div 
        className="logo-container"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          type: 'spring',
          damping: 20,
          stiffness: 100,
          duration: 0.6 
        }}
        whileHover={{ 
          scale: 1.02,
          boxShadow: '0 10px 30px rgba(103, 80, 164, 0.25)'
        }}
      >
        <Image
          src="/logo.jpg"
          alt="Dr. Agarwal's Mental Healthcare Clinic"
          width={600}
          height={270}
          style={{
            objectFit: 'contain',
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(103, 80, 164, 0.18)'
          }}
          priority
        />
      </motion.div>
    </div>
  );
};

export default Logo; 