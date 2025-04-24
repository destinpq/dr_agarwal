"use client";

import { useState } from 'react';
import { 
  Form, Input, Button, Table, Space, Modal, 
  notification, Card, Typography, Select,
  Popconfirm
} from 'antd';
import { 
  UserOutlined, LockOutlined, EditOutlined, 
  DeleteOutlined, EyeOutlined, PlusOutlined 
} from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;

// Interface for registration data
interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  interestArea: string;
  preferredTiming: string;
  preferredDates: string[];
  expectations?: string;
  referralSource: string;
  paymentStatus: string;
  createdAt: string;
}

export default function AdminPage() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // CRUD state
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Registration | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');
  const [form] = Form.useForm();

  // Handle login
  const handleLogin = () => {
    setIsLoading(true);
    
    // Check hardcoded credentials
    if (username === 'akanksha' && password === 'Akanksha100991!') {
      setTimeout(() => {
        setIsAuthenticated(true);
        setIsLoading(false);
        notification.success({
          message: 'Login Successful',
          description: 'Welcome to the admin dashboard!',
          placement: 'topRight'
        });
        fetchRegistrations();
      }, 1000);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        notification.error({
          message: 'Login Failed',
          description: 'Invalid username or password.',
          placement: 'topRight'
        });
      }, 1000);
    }
  };

  // Fetch registrations from API
  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      // Use next.js API routes as a proxy to the backend
      const response = await fetch('/api/registrations');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch registrations: ${response.statusText}`);
      }
      
      const data = await response.json();
      setRegistrations(data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      notification.error({
        message: 'Fetch Error',
        description: 'Failed to load registrations. Please try again.',
        placement: 'topRight'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle record viewing
  const showViewModal = (record: Registration) => {
    setCurrentRecord(record);
    setModalMode('view');
    setIsModalVisible(true);
  };

  // Handle record editing
  const showEditModal = (record: Registration) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      ...record,
      preferredDates: record.preferredDates ? record.preferredDates.join(', ') : ''
    });
    setModalMode('edit');
    setIsModalVisible(true);
  };

  // Handle record creation
  const showCreateModal = () => {
    setCurrentRecord(null);
    form.resetFields();
    setModalMode('create');
    setIsModalVisible(true);
  };

  // Modal cancel handler
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Save handler for edit/create
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      // Format data
      const formattedValues = {
        ...values,
        preferredDates: values.preferredDates 
          ? values.preferredDates.split(',').map((date: string) => date.trim())
          : []
      };
      
      if (modalMode === 'edit' && currentRecord) {
        // Update existing record using our API route
        const response = await fetch(`/api/registrations/${currentRecord.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedValues),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update registration: ${response.statusText}`);
        }
        
        notification.success({
          message: 'Update Successful',
          description: `Registration for ${values.name} was updated successfully.`,
          placement: 'topRight'
        });
      } else {
        // Create new record
        const response = await fetch(`/api/registrations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedValues),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to create registration: ${response.statusText}`);
        }
        
        notification.success({
          message: 'Creation Successful',
          description: `Registration for ${values.name} was created successfully.`,
          placement: 'topRight'
        });
      }
      
      setIsModalVisible(false);
      fetchRegistrations(); // Refresh the list
      
    } catch (error) {
      console.error('Validation or submission error:', error);
      notification.error({
        message: 'Operation Failed',
        description: error instanceof Error ? error.message : 'Failed to save registration.',
        placement: 'topRight'
      });
    }
  };

  // Delete record handler
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/registrations/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete registration: ${response.statusText}`);
      }
      
      notification.success({
        message: 'Deletion Successful',
        description: 'Registration was deleted successfully.',
        placement: 'topRight'
      });
      
      fetchRegistrations(); // Refresh the list
    } catch (error) {
      console.error('Delete error:', error);
      notification.error({
        message: 'Deletion Failed',
        description: error instanceof Error ? error.message : 'Failed to delete registration.',
        placement: 'topRight'
      });
    }
  };

  // Table columns definition
  const columns: ColumnsType<Registration> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Registration, b: Registration) => a.name.localeCompare(b.name),
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
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a: Registration, b: Registration) => a.age - b.age,
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Completed', value: 'completed' },
      ],
      onFilter: (value, record: Registration) => record.paymentStatus === value,
      render: (status: string) => (
        <Text 
          style={{ 
            color: status === 'completed' ? '#52c41a' : '#faad14',
            fontWeight: 'bold'
          }}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: Registration) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => showViewModal(record)}
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this registration?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Login Form
  if (!isAuthenticated) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f5f5f5'
      }}>
        <Card
          style={{ 
            width: 400, 
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            borderRadius: '8px'
          }}
          title={
            <Title level={3} style={{ textAlign: 'center', margin: '12px 0', color: '#722ed1' }}>
              Admin Login
            </Title>
          }
        >
          <Form
            name="login"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={handleLogin}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input 
                prefix={<UserOutlined style={{ color: '#722ed1' }} />}
                placeholder="Username" 
                size="large"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#722ed1' }} />}
                placeholder="Password"
                size="large"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                style={{ 
                  width: '100%', 
                  height: '40px',
                  background: '#722ed1',
                  borderColor: '#722ed1'
                }}
                loading={isLoading}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <Title level={2} style={{ margin: 0, color: '#722ed1' }}>
          Workshop Registrations Dashboard
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={showCreateModal}
          style={{ 
            background: '#722ed1',
            borderColor: '#722ed1'
          }}
        >
          New Registration
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={registrations}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          style={{ marginTop: '16px' }}
        />
      </Card>

      {/* View/Edit/Create Modal */}
      <Modal
        title={
          modalMode === 'view' 
            ? 'Registration Details' 
            : modalMode === 'edit' 
              ? 'Edit Registration'
              : 'Create Registration'
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={modalMode === 'view' ? [
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>
        ] : [
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSave}>
            Save
          </Button>
        ]}
        width={800}
      >
        {modalMode === 'view' && currentRecord ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <Text strong>Name:</Text> <Text>{currentRecord.name}</Text>
            </div>
            <div>
              <Text strong>Email:</Text> <Text>{currentRecord.email}</Text>
            </div>
            <div>
              <Text strong>Phone:</Text> <Text>{currentRecord.phone}</Text>
            </div>
            <div>
              <Text strong>Age:</Text> <Text>{currentRecord.age}</Text>
            </div>
            <div>
              <Text strong>Interest Area:</Text> <Text>{currentRecord.interestArea}</Text>
            </div>
            <div>
              <Text strong>Preferred Timing:</Text> <Text>{currentRecord.preferredTiming}</Text>
            </div>
            <div>
              <Text strong>Preferred Dates:</Text> <Text>{currentRecord.preferredDates?.join(', ')}</Text>
            </div>
            <div>
              <Text strong>Referral Source:</Text> <Text>{currentRecord.referralSource}</Text>
            </div>
            <div>
              <Text strong>Payment Status:</Text> <Text>{currentRecord.paymentStatus}</Text>
            </div>
            <div>
              <Text strong>Created At:</Text> <Text>{new Date(currentRecord.createdAt).toLocaleString()}</Text>
            </div>
            <div style={{ gridColumn: '1 / span 2' }}>
              <Text strong>Expectations:</Text> <Text>{currentRecord.expectations || 'None'}</Text>
            </div>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            name="registration_form"
            initialValues={{ 
              paymentStatus: 'pending',
              preferredTiming: 'morning'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter full name' }]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>
              
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
              
              <Form.Item
                name="phone"
                label="Phone"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
              
              <Form.Item
                name="age"
                label="Age"
                rules={[
                  { required: true, message: 'Please enter age' },
                  { type: 'number', min: 18, max: 100, message: 'Age must be between 18 and 100' }
                ]}
              >
                <Input type="number" placeholder="Enter age" />
              </Form.Item>
              
              <Form.Item
                name="interestArea"
                label="Area of Interest"
                rules={[{ required: true, message: 'Please select area of interest' }]}
              >
                <Select placeholder="Select area of interest">
                  <Option value="clinical">Clinical Psychology</Option>
                  <Option value="cognitive">Cognitive Psychology</Option>
                  <Option value="developmental">Developmental Psychology</Option>
                  <Option value="social">Social Psychology</Option>
                  <Option value="counseling">Counseling Psychology</Option>
                  <Option value="educational">Educational Psychology</Option>
                  <Option value="industrial">Industrial-Organizational Psychology</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="preferredTiming"
                label="Preferred Timing"
                rules={[{ required: true, message: 'Please select preferred timing' }]}
              >
                <Select placeholder="Select preferred timing">
                  <Option value="morning">Morning (10 AM - 12 PM)</Option>
                  <Option value="afternoon">Afternoon (2 PM - 4 PM)</Option>
                  <Option value="evening">Evening (6 PM - 8 PM)</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="preferredDates"
                label="Preferred Dates (comma-separated)"
                rules={[{ required: true, message: 'Please enter preferred dates' }]}
              >
                <Input placeholder="YYYY-MM-DD, YYYY-MM-DD" />
              </Form.Item>
              
              <Form.Item
                name="referralSource"
                label="Referral Source"
                rules={[{ required: true, message: 'Please select referral source' }]}
              >
                <Select placeholder="Select referral source">
                  <Option value="social">Social Media</Option>
                  <Option value="friend">Friend or Colleague</Option>
                  <Option value="search">Search Engine</Option>
                  <Option value="email">Email Newsletter</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="paymentStatus"
                label="Payment Status"
                rules={[{ required: true, message: 'Please select payment status' }]}
              >
                <Select placeholder="Select payment status">
                  <Option value="pending">Pending</Option>
                  <Option value="completed">Completed</Option>
                </Select>
              </Form.Item>
            </div>
            
            <Form.Item
              name="expectations"
              label="Expectations"
            >
              <Input.TextArea rows={4} placeholder="Enter expectations..." />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
} 