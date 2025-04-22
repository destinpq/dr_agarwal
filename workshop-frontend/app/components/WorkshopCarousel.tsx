"use client";

import { Carousel, Typography } from 'antd';
import { motion } from 'framer-motion';

const { Title } = Typography;

// Workshop images for carousel
const workshopImages = [
  {
    url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    title: "Interactive Sessions"
  },
  {
    url: "https://images.unsplash.com/photo-1573166364524-d9dbfd8bbf83?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80",
    title: "Expert Guidance"
  }
];

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 300
    }
  }
};

export default function WorkshopCarousel() {
  return (
    <motion.div
      variants={cardVariants}
      style={{ 
        marginBottom: 40, 
        width: '100%', 
        maxWidth: '1200px',
        boxSizing: 'border-box',
        overflow: 'visible',
        padding: '0 1rem',
        margin: '0 auto'
      }}
    >
      <Carousel 
        autoplay 
        effect="fade" 
        style={{ 
          borderRadius: 16, 
          overflow: 'hidden', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          width: '100%'
        }}
        accessibility={false}
        pauseOnFocus={true}
      >
        {workshopImages.map((image, index) => (
          <div key={index} style={{ width: '100%' }}>
            <div style={{ 
              height: 300, 
              background: `url(${image.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              width: '100%',
              borderRadius: '16px'
            }}>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(0,0,0,0.6)',
                padding: '15px',
                color: 'white',
                textAlign: 'center',
                borderRadius: '0 0 16px 16px'
              }}>
                <Title level={4} style={{ color: 'white', margin: 0 }}>{image.title}</Title>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </motion.div>
  );
} 