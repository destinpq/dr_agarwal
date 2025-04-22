"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Logo = () => {
  const [imgError, setImgError] = useState(false);

  // Fallback image source (inline base64 placeholder)
  const fallbackImgSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='270' viewBox='0 0 600 270'%3E%3Crect width='600' height='270' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' text-anchor='middle' fill='%23666666'%3EDr. Agarwal&apos;s Clinic%3C/text%3E%3C/svg%3E";

  return (
    <div style={{ 
      textAlign: 'center', 
      marginBottom: '2.5rem',
      marginTop: '1.5rem',
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      maxWidth: '100%',
      padding: '0',
      overflow: 'visible',
      position: 'relative'
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
        style={{
          width: '100%',
          maxWidth: '1200px',
          position: 'relative',
          margin: '0 auto',
          padding: '0 1rem',
          boxSizing: 'border-box',
          overflow: 'visible'
        }}
      >
        {imgError ? (
          // Fallback to a div with styled text if image fails to load
          <div style={{
            width: '100%',
            height: 'auto',
            minHeight: '270px',
            maxWidth: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            borderRadius: '16px',
            boxShadow: '0 8px 25px rgba(103, 80, 164, 0.18)',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#4b4b4b',
            padding: '20px'
          }}>
            Dr. Agarwal&apos;s Mental Healthcare Clinic
          </div>
        ) : (
          // Try to load the image
          <Image
            src={imgError ? fallbackImgSrc : "/logo.jpg"}
            alt="Dr. Agarwal's Mental Healthcare Clinic"
            width={1200}
            height={540}
            style={{
              objectFit: 'contain',
              width: '100%',
              height: 'auto',
              borderRadius: '16px',
              boxShadow: '0 8px 25px rgba(103, 80, 164, 0.18)'
            }}
            priority
            onError={() => setImgError(true)}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Logo; 