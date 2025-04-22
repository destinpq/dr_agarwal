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

      <div className="content-container">
        <WorkshopBenefits />

        <motion.div
          whileHover={{ boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
          style={{ marginBottom: 40 }}
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
              overflow: 'hidden'
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

        <Testimonials />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.1 }}
          style={{ 
            marginTop: 60, 
            marginBottom: 40,
            padding: '30px',
            borderRadius: '20px',
            backgroundColor: 'rgba(103, 80, 164, 0.05)',
            boxShadow: '0 6px 24px rgba(103, 80, 164, 0.08)',
            border: '1px solid rgba(103, 80, 164, 0.1)',
          }}
        >
          <Title level={2} className="section-title-underline" style={{ 
            textAlign: 'center', 
            marginBottom: '35px',
            position: 'relative',
            display: 'inline-block',
            left: '50%',
            transform: 'translateX(-50%)'
          }}>
            Contact Us
          </Title>
          
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '20px',
            justifyContent: 'center', 
            alignItems: 'flex-start',
            textAlign: 'center' 
          }}>
            <Card 
              style={{ 
                width: '300px', 
                borderRadius: '15px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              hoverable
            >
              <MailOutlined style={{ fontSize: '28px', color: '#722ed1', marginBottom: '10px' }} />
              <Title level={4}>Email Us</Title>
              <Paragraph>
                <a href="mailto:support@destinpq.com" style={{ color: '#722ed1' }}>
                  support@destinpq.com
                </a>
              </Paragraph>
              <Paragraph type="secondary">For registrations and queries</Paragraph>
            </Card>
            
            <Card 
              style={{ 
                width: '300px', 
                borderRadius: '15px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              hoverable
            >
              <PhoneOutlined style={{ fontSize: '28px', color: '#722ed1', marginBottom: '10px' }} />
              <Title level={4}>Call Us</Title>
              <Paragraph>
                <a href="tel:+919876543210" style={{ color: '#722ed1' }}>
                  +91 9876 543 210
                </a>
              </Paragraph>
              <Paragraph type="secondary">Monday to Friday, 9am-5pm</Paragraph>
            </Card>
            
            <Card 
              style={{ 
                width: '300px', 
                borderRadius: '15px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              hoverable
            >
              <GlobalOutlined style={{ fontSize: '28px', color: '#722ed1', marginBottom: '10px' }} />
              <Title level={4}>Visit Us</Title>
              <Paragraph>
                <a href="https://destinpq.com" target="_blank" rel="noopener noreferrer" style={{ color: '#722ed1' }}>
                  destinpq.com
                </a>
              </Paragraph>
              <Paragraph type="secondary">Learn more about our services</Paragraph>
            </Card>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{ 
            textAlign: 'center', 
            marginTop: 40, 
            marginBottom: 40, 
            padding: '20px',
            borderTop: '1px solid rgba(103, 80, 164, 0.1)'
          }}
        >
          <Text type="secondary">
            © 2023 Dr. Agarwal&apos;s Mental Healthcare Clinic. All rights reserved.
          </Text>
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <Text type="secondary" style={{ cursor: 'pointer' }}>Privacy Policy</Text>
            <Text type="secondary" style={{ cursor: 'pointer' }}>Terms of Service</Text>
            <Text type="secondary" style={{ cursor: 'pointer' }}>FAQ</Text>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
} 