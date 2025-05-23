"use client";

import React from 'react';
import { Card, Typography, Divider } from 'antd';
import { StarOutlined, TeamOutlined, TrophyOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title } = Typography;

const benefits = [
  {
    icon: <StarOutlined style={{ fontSize: 30, color: '#722ed1' }} />,
    title: 'Expert-led Sessions',
    description: 'Learn from industry-leading psychologists with years of experience in various psychological domains.'
  },
  {
    icon: <TeamOutlined style={{ fontSize: 30, color: '#722ed1' }} />,
    title: 'Networking',
    description: 'Connect with like-minded individuals in the field of psychology and expand your professional network.'
  },
  {
    icon: <TrophyOutlined style={{ fontSize: 30, color: '#722ed1' }} />,
    title: 'Practical Skills',
    description: 'Develop practical skills and techniques that you can apply in real-world situations immediately.'
  },
  {
    icon: <ThunderboltOutlined style={{ fontSize: 30, color: '#722ed1' }} />,
    title: 'Interactive Learning',
    description: 'Engage in interactive activities, discussions, and case studies for a comprehensive learning experience.'
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const WorkshopBenefits = () => {
  return (
    <section className="benefits-section" style={{ 
      width: '100vw !important', 
      maxWidth: '100vw !important',
      overflow: 'visible'
    }}>
      <Title level={2} style={{ 
        textAlign: 'center', 
        marginBottom: '2rem',
        position: 'relative',
        display: 'inline-block',
        left: '50%',
        transform: 'translateX(-50%)'
      }}>
        Workshop Benefits
        <div style={{ 
          position: 'absolute', 
          bottom: '-10px', 
          left: '25%', 
          width: '50%', 
          height: '3px', 
          background: 'linear-gradient(90deg, transparent, #722ed1, transparent)',
          borderRadius: '3px'
        }}></div>
      </Title>

      <motion.div 
        className="workshop-benefits-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        style={{ 
          width: '100%',
          maxWidth: '1200px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          margin: '2.5rem auto',
          padding: '0 1rem',
          boxSizing: 'border-box'
        }}
      >
        {benefits.map((benefit, index) => (
          <motion.div key={index} variants={cardVariants} style={{ width: '100%' }}>
            <Card 
              className="benefit-card"
              hoverable
              style={{ 
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid rgba(103, 80, 164, 0.1)',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                margin: '0 auto',
                overflow: 'visible'
              }}
            >
              <div className="benefit-icon" style={{
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(103, 80, 164, 0.1)',
                borderRadius: '50%',
                marginBottom: '1rem',
                flexShrink: 0
              }}>
                {benefit.icon}
              </div>
              <div className="benefit-title" style={{
                fontSize: '1.2rem',
                fontWeight: 600,
                color: '#222',
                marginBottom: '0.75rem',
                textAlign: 'center'
              }}>
                {benefit.title}
              </div>
              <Divider style={{ margin: '12px 0', borderColor: '#f0e6ff', width: '100%' }}/>
              <div className="benefit-description" style={{
                color: '#666',
                fontSize: '0.95rem',
                lineHeight: 1.5,
                textAlign: 'center'
              }}>
                {benefit.description}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default WorkshopBenefits; 