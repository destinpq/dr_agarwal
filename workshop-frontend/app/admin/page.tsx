"use client";

import { useState, useEffect, useCallback } from 'react';
import { Table, Card, Typography, Image, Button, Input, Space, message, Modal } from 'antd';
import { SearchOutlined, EyeOutlined, FileImageOutlined, LockOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  paymentStatus: string;
  amount: number;
  createdAt: string;
  paymentScreenshot?: string;
}

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8082';

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/registrations`);
      if (!response.ok) {
        throw new Error('Failed to fetch registrations');
      }
      const data = await response.json();
      setRegistrations(data);
    } catch (err) {
      message.error('Failed to load registrations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    const storedAuth = localStorage.getItem('admin_authenticated');
    if (storedAuth === 'true') {
      setAuthenticated(true);
      fetchRegistrations();
    } else {
      setLoading(false);
    }
  }, [fetchRegistrations]);

  const authenticate = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setAuthenticated(true);
        localStorage.setItem('admin_authenticated', 'true');
        fetchRegistrations();
      } else {
        message.error('Authentication failed. Please check your password.');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      message.error('Failed to authenticate. Please try again.');
    }
  };

  const handlePreview = (imageUrl: string) => {
    setPreviewImage(`${backendUrl}${imageUrl}`);
    setPreviewVisible(true);
  };

  const filteredRegistrations = registrations.filter(
    (reg) => 
      reg.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
      reg.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      reg.phone?.includes(searchText)
  );

  const columns: ColumnsType<Registration> = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `₹${amount.toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status) => (
        <Text
          style={{ 
            padding: '4px 8px', 
            borderRadius: '4px',
            backgroundColor: status === 'PAID' ? '#f6ffed' : '#fff7e6',
            color: status === 'PAID' ? '#52c41a' : '#fa8c16',
            border: `1px solid ${status === 'PAID' ? '#b7eb8f' : '#ffe7ba'}`
          }}
        >
          {status}
        </Text>
      ),
      filters: [
        { text: 'PAID', value: 'PAID' },
        { text: 'PENDING', value: 'PENDING' },
      ],
      onFilter: (value, record) => record.paymentStatus === value,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Payment',
      key: 'paymentScreenshot',
      render: (_, record) => (
        record.paymentScreenshot ? (
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            onClick={() => handlePreview(`/api/registrations/${record.id}/screenshot`)}
          >
            View
          </Button>
        ) : (
          <Text type="secondary"><FileImageOutlined /> No image</Text>
        )
      ),
    },
  ];

  if (!authenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Card style={{ width: 400, padding: '20px' }}>
          <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>
            <LockOutlined /> Admin Login
          </Title>
          <Input.Password
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onPressEnter={authenticate}
            style={{ marginBottom: '16px' }}
          />
          <Button type="primary" block onClick={authenticate}>
            Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
          <Title level={3}>Registration Management</Title>
          <Space>
            <Input
              placeholder="Search by name, email or phone"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
            />
            <Button type="primary" onClick={fetchRegistrations}>Refresh</Button>
          </Space>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={filteredRegistrations}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        open={previewVisible}
        title="Payment Screenshot"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
      >
        {previewImage && (
          <div style={{ textAlign: 'center' }}>
            <Image
              alt="Payment Screenshot"
              src={previewImage}
              style={{ maxWidth: '100%' }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
} 