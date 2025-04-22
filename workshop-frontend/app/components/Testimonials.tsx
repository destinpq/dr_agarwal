"use client";

import React from 'react';
import { Carousel, Card, Avatar, Typography, Rate, Space } from 'antd';
import { UserOutlined, MessageOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const testimonials = [
  {
    name: "Priya Sharma",
    position: "Psychology Student",
    comment: "The workshop expanded my understanding of cognitive processes and provided practical techniques I can apply in my studies. Highly recommend it to anyone interested in psychology!",
    rating: 5,
    avatar: null,
  },
  {
    name: "Rahul Patel",
    position: "Counselor",
    comment: "As a practicing counselor, I found the workshop immensely valuable. The expert insights and interactive exercises helped me develop new approaches to therapy sessions.",
    rating: 5,
    avatar: null,
  },
  {
    name: "Anjali Desai",
    position: "HR Professional",
    comment: "Attending this workshop has transformed how I approach workplace psychology. The networking opportunities were fantastic, and I'm already implementing the knowledge gained.",
    rating: 4.5,
    avatar: null,
  },
  {
    name: "Vikram Kapoor",
    position: "School Teacher",
    comment: "The educational psychology segment was eye-opening. I've changed my teaching approach based on what I learned, with noticeable positive results among my students.",
    rating: 5,
    avatar: null,
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const Testimonials = () => {
  return (
    <motion.section
      className="testimonials-section"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      style={{ 
        width: '100%', 
        maxWidth: '1200px',
        boxSizing: 'border-box',
        overflow: 'visible',
        margin: '3rem auto',
        padding: '0 1rem'
      }}
    >
      <Title level={2} style={{ 
        textAlign: 'center', 
        marginBottom: '2rem',
        position: 'relative',
        display: 'inline-block',
        left: '50%',
        transform: 'translateX(-50%)'
      }}>
        What Participants Say
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

      <Carousel
        autoplay
        dots
        autoplaySpeed={5000}
        pauseOnHover
        className="testimonial-carousel"
        style={{
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden'
        }}
      >
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-slide" style={{ width: '100%', padding: '20px 0' }}>
            <Card 
              className="testimonial-card"
              style={{
                borderRadius: '16px',
                margin: '10px auto 30px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                width: 'calc(100% - 40px)',
                maxWidth: '800px',
                padding: '30px',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}
            >
              <div className="testimonial-quote-icon" style={{
                position: 'absolute',
                top: '15px',
                right: '20px',
                opacity: 0.8
              }}>
                <MessageOutlined style={{ fontSize: 30, color: 'rgba(114, 46, 209, 0.15)' }} />
              </div>
              
              <div className="testimonial-content" style={{
                marginBottom: '20px',
                position: 'relative',
                zIndex: 1
              }}>
                <Text style={{ fontSize: '16px', lineHeight: 1.6, color: '#555', fontStyle: 'italic' }}>
                  &ldquo;{testimonial.comment}&rdquo;
                </Text>
              </div>
              
              <div className="testimonial-rating" style={{ margin: '15px 0' }}>
                <Rate disabled defaultValue={testimonial.rating} allowHalf />
              </div>
              
              <Space size="small" align="center">
                <Avatar 
                  size={48} 
                  icon={<UserOutlined />} 
                  style={{ 
                    backgroundColor: '#722ed1', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }} 
                />
                <div>
                  <Text strong style={{ fontSize: '16px', display: 'block' }}>{testimonial.name}</Text>
                  <Text type="secondary" style={{ fontSize: '14px' }}>{testimonial.position}</Text>
                </div>
              </Space>
            </Card>
          </div>
        ))}
      </Carousel>
    </motion.section>
  );
};

export default Testimonials; 