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
    <section className="benefits-section">
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
      >
        {benefits.map((benefit, index) => (
          <motion.div key={index} variants={cardVariants}>
            <Card 
              className="benefit-card"
              hoverable
            >
              <div className="benefit-icon">{benefit.icon}</div>
              <div className="benefit-title">{benefit.title}</div>
              <Divider style={{ margin: '12px 0', borderColor: '#f0e6ff' }}/>
              <div className="benefit-description">{benefit.description}</div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default WorkshopBenefits; 