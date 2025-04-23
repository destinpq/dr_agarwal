"use client";

import React from 'react';
import { Button, Modal, Image, Typography, Divider, Tooltip, notification } from 'antd';
import { MobileOutlined, CopyOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface PaymentButtonProps {
  onInstruct: () => void;
}

export default function PaymentButton({ onInstruct }: PaymentButtonProps) {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  
  const showModal = () => {
    setIsModalVisible(true);
  };
  
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  
  const handleConfirm = () => {
    // Show success notification
    notification.success({
      message: 'Payment Recorded',
      description: 'Your payment has been recorded. Now please upload the screenshot for verification.',
      placement: 'topRight',
      duration: 5,
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
    });
    
    setIsModalVisible(false);
    onInstruct();
    
    // Log the event for analytics
    console.log('Payment confirmation recorded by user');
  };
  
  const copyUpiId = () => {
    navigator.clipboard.writeText('drakankshaagarwal@sbi');
    notification.success({
      message: 'UPI ID Copied',
      description: 'UPI ID has been copied to clipboard',
      placement: 'topRight',
      duration: 3
    });
  };
  
  const openUpiApp = () => {
    // Create a UPI deep link
    const upiLink = 'upi://pay?pa=drakankshaagarwal@sbi&pn=Akanksha%20Agarwal&am=5000';
    
    // Open the UPI link
    window.location.href = upiLink;
    
    // Show success notification
    notification.success({
      message: 'Payment Initiated',
      description: 'UPI payment app opened. Complete the payment in your UPI app.',
      placement: 'topRight',
      duration: 5,
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
    });
  };

  return (
    <>
      <Button 
        type="primary" 
        size="large" 
        onClick={showModal}
        className="payment-button"
        block
        icon={<MobileOutlined />}
      >
        Proceed to Payment
      </Button>
      
      <Modal
        title={<Title level={4} style={{ margin: 0 }}>Pay Workshop Fee</Title>}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button 
            key="confirm" 
            type="primary" 
            onClick={handleConfirm}
          >
            I&apos;ve Made the Payment
          </Button>
        ]}
        width={500}
        className="payment-modal"
        centered={true}
      >
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <div style={{ 
            backgroundColor: '#f5f5f5', 
            borderRadius: '12px', 
            padding: '15px', 
            marginBottom: '20px',
            border: '1px solid #e8e8e8'
          }}>
            <Image 
              src="/upi.jpeg" 
              alt="UPI QR Code" 
              style={{ maxWidth: '250px', margin: '0 auto', borderRadius: '8px' }}
              preview={false}
              onLoad={() => console.log("UPI QR code image loaded successfully")}
              onError={() => console.error("Error loading UPI QR code image")}
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="
            />
          </div>
          
          <Paragraph style={{ textAlign: 'center', marginBottom: '15px' }}>
            Scan the QR code using any UPI app to make a payment
          </Paragraph>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '15px',
            background: '#f9f9f9',
            padding: '8px 15px',
            borderRadius: '8px',
            border: '1px solid #eee'
          }}>
            <Text style={{ marginRight: '10px' }} strong>UPI ID: drakankshaagarwal@sbi</Text>
            <Tooltip title="Copy UPI ID">
              <Button 
                icon={<CopyOutlined />} 
                size="small" 
                onClick={copyUpiId}
                type="text"
              />
            </Tooltip>
          </div>
          
          <Button
            type="primary"
            onClick={openUpiApp}
            style={{ 
              marginBottom: '15px',
              background: '#52c41a',
              borderColor: '#52c41a'
            }}
            icon={<MobileOutlined />}
          >
            Pay via UPI App (₹5,000)
          </Button>
          
          <Divider style={{ margin: '15px 0' }} />
          
          <div style={{ textAlign: 'left' }}>
            <Title level={5} style={{ marginBottom: '10px' }}>Instructions:</Title>
            <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
              <li>Payment amount: ₹5,000</li>
              <li>After payment, click &quot;I&apos;ve Made the Payment&quot;</li>
              <li>You&apos;ll be prompted to upload a screenshot as proof</li>
              <li>Your registration will be confirmed after verification</li>
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
}