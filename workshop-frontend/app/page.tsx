"use client";

import { useState } from 'react';
import { Typography, Badge, Card, Button } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { FireOutlined, MailOutlined, PhoneOutlined, GlobalOutlined, HeartOutlined } from '@ant-design/icons';
import RegistrationForm from './components/RegistrationForm';
import SuccessMessage from './components/SuccessMessage';
import WorkshopBenefits from './components/WorkshopBenefits';
import Testimonials from './components/Testimonials';
import Logo from './components/Logo';

const { Title, Paragraph, Text } = Typography;

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        damping: 25,
        stiffness: 500,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container"
      style={{
        width: '100%',
        maxWidth: '100%',
        left: 0,
        right: 0,
        padding: 0,
        margin: 0,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <section className="hero-section">
        <Logo />
        
        <motion.div 
          className="header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: 'spring', 
            damping: 20, 
            stiffness: 100,
            delay: 0.2 
          }}
          style={{
            width: '100%',
            maxWidth: 'calc(100% - 2rem)'
          }}
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.4 }}
          >
            <Badge.Ribbon text="Limited Spots!" color="purple">
              <h1 className="brand-heading">Psychology Workshop</h1>
              <Title level={2} style={{ fontWeight: 700, marginBottom: 8, color: '#1a1a1a' }}>
                Registration
              </Title>
            </Badge.Ribbon>
          </motion.div>
          <Paragraph style={{ fontSize: 16, marginBottom: 0, color: 'var(--secondary-text)' }}>
            Join our exclusive workshop and enhance your understanding of psychological principles
          </Paragraph>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{ marginTop: 20 }}
          >
            <Button 
              type="primary" 
              size="large" 
              shape="round"
              icon={<HeartOutlined />}
              onClick={() => {
                const registrationSection = document.getElementById('registration-form');
                registrationSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ 
                background: 'linear-gradient(45deg, #722ed1, #a855f7)',
                border: 'none',
                boxShadow: '0 6px 16px rgba(114, 46, 209, 0.3)'
              }}
            >
              Register Now
            </Button>
          </motion.div>
        </motion.div>
        
        <div className="hero-decoration left"></div>
        <div className="hero-decoration right"></div>
      </section>

      <div className="content-container" style={{ 
        width: '100%', 
        maxWidth: '100%',
        overflow: 'visible' 
      }}>
        <WorkshopBenefits />

        <motion.div
          whileHover={{ boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
          style={{ 
            marginBottom: 40, 
            width: '100%', 
            maxWidth: '1200px',
            padding: '0 1rem',
            margin: '0 auto'
          }}
          id="registration-form"
        >
          <Card
            title={
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <FireOutlined style={{ color: '#ff4d4f', fontSize: 24, marginRight: 8 }} />
                <span style={{ fontSize: 18, fontWeight: 600 }}>Register Now</span>
              </div>
            }
            variant="outlined"
            styles={{ 
              header: { 
                borderBottom: '2px solid #f0f0f0',
                background: 'linear-gradient(to right, #f0e7ff, #f5f0ff)'
              },
              body: { padding: '24px' }
            }}
            style={{ 
              borderRadius: 16, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              width: '100%',
              maxWidth: '100%'
            }}
          >
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <SuccessMessage onRegisterAnother={() => setIsSubmitted(false)} />
              ) : (
                <RegistrationForm onSuccess={() => setIsSubmitted(true)} />
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        
        
      </div>
    </motion.div>
  );
} 