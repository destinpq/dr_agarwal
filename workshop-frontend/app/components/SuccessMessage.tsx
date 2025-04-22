"use client";

import { motion } from 'framer-motion';
import { Button, Typography, Avatar } from 'antd';
import { CheckCircleOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface SuccessMessageProps {
  onRegisterAnother: () => void;
}

export default function SuccessMessage({ onRegisterAnother }: SuccessMessageProps) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="success-message"
      style={{ 
        textAlign: 'center', 
        padding: '40px 20px',
        borderRadius: 16,
        backgroundColor: '#f6ffed',
        border: '1px solid #b7eb8f',
        marginBottom: 40
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.4, bounce: 0.5 }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ 
            delay: 0.4, 
            duration: 0.3, 
            times: [0, 0.6, 1],
            type: 'keyframes'
          }}
        >
          <Avatar 
            icon={<CheckCircleOutlined />} 
            size={80} 
            style={{ 
              backgroundColor: '#52c41a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20 
            }} 
          />
        </motion.div>
      </motion.div>
      <Title level={2} style={{ color: '#52c41a' }}>Thank you for registering!</Title>
      <Paragraph style={{ fontSize: 16, marginBottom: 30 }}>
        Your registration has been submitted successfully. We&apos;ll contact you shortly with more details about the workshop.
      </Paragraph>
      <Button 
        type="primary" 
        size="large"
        onClick={onRegisterAnother}
        icon={<UserOutlined />}
        style={{ 
          background: 'linear-gradient(to right, #722ed1, #b37feb)',
          border: 'none'
        }}
      >
        Register Another Person
      </Button>
    </motion.div>
  );
} 