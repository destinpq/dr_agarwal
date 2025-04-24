"use client";

import { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { 
  Form, Input, Button, Select, 
  Upload, Typography, Radio, 
  Space, notification, Steps
} from 'antd';
import { 
  UserOutlined, MailOutlined, 
  UploadOutlined, 
  BulbOutlined, InfoCircleOutlined, CalendarOutlined,
  NumberOutlined, CheckCircleOutlined, PhoneOutlined
} from '@ant-design/icons';
import PaymentButton from './PaymentButton';

const { Title, Paragraph } = Typography;
const { Option } = Select;

// Define the form data structure
interface IFormInput {
  name: string;
  email: string;
  age: number;
  interestArea: string;
  preferredTiming: string;
  expectations: string;
  paymentScreenshot: FileList;
  phone: string;
  referralSource: string;
}

interface RegistrationFormProps {
  onSuccess: () => void;
}

interface FileInfo {
  file: {
    status?: string;
    originFileObj?: File;
  };
  fileList: Array<{
    uid: string;
    name: string;
    status?: string;
    url?: string;
    originFileObj?: File;
  }>;
}

export default function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPaymentUpload, setShowPaymentUpload] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    control, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm<IFormInput>({
    defaultValues: {
      preferredTiming: 'morning'
    },
    mode: 'onBlur' // Validate on blur for better user experience
  });

  const handlePaymentInstructed = () => {
    setShowPaymentUpload(true);
    setCurrentStep(1);
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (isSubmitting) {
      console.log('Preventing duplicate submission');
      return;
    }
    
    setIsLoading(true);
    setIsSubmitting(true);
    
    try {
      // Validate all required fields are present
      const requiredFields = [
        { field: 'name', label: 'Full Name' },
        { field: 'email', label: 'Email Address' },
        { field: 'phone', label: 'Phone Number' },
        { field: 'age', label: 'Age' },
        { field: 'interestArea', label: 'Area of Interest' },
        { field: 'preferredTiming', label: 'Preferred Timing' },
        { field: 'referralSource', label: 'Referral Source' }
      ];
      
      // Only validate payment screenshot if in payment step
      if (showPaymentUpload) {
        requiredFields.push({ field: 'paymentScreenshot', label: 'Payment Screenshot' });
      }
      
      const missingFields = requiredFields.filter(rf => !data[rf.field as keyof IFormInput]);
      
      if (missingFields.length > 0) {
        const missingFieldNames = missingFields.map(f => f.label).join(', ');
        notification.error({
          message: 'Form Validation Failed',
          description: `Please fill in all required fields: ${missingFieldNames}`,
          placement: 'topRight',
          duration: 5
        });
        setIsLoading(false);
        return;
      }
    
      // Format data for API submission
      const formData = new FormData();
      
      // Add form fields to FormData
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('age', data.age.toString());
      formData.append('interestArea', data.interestArea);
      
      // Use fixed dates for the workshop
      formData.append('preferredDates[]', '2025-05-05');
      formData.append('preferredDates[]', '2025-05-30');
      
      formData.append('preferredTiming', data.preferredTiming);
      
      if (data.expectations) {
        formData.append('expectations', data.expectations);
      }
      
      formData.append('referralSource', data.referralSource);
      formData.append('paymentStatus', showPaymentUpload ? 'completed' : 'pending');
      
      // Add payment screenshot if available
      if (showPaymentUpload && data.paymentScreenshot && data.paymentScreenshot.length > 0) {
        // Get the file directly from the FileList
        const file = data.paymentScreenshot[0] as unknown as File;
        
        // Append file with original filename for multipart/form-data
        try {
          // Log file details before adding to form
          console.log('Payment screenshot details:', {
            name: file.name,
            type: file.type,
            size: file.size
          });
          
          // Add file to form data - ensure we're providing the file name
          formData.append('paymentScreenshot', file, file.name);
          console.log('Successfully added file to FormData');
        } catch (fileError) {
          console.error('Error adding file to FormData:', fileError);
        }
        
        console.log('Added payment screenshot to form data:', {
          name: file.name,
          type: file.type,
          size: file.size
        });
      }
      
      // Debug log the form data being sent
      console.log('Form submission - fields:', Object.fromEntries(formData.entries()));
      
      let response;
      let responseData;
      
      // Log browser environment variables
      console.log('Environment check:', {
        NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'not set',
        window_location: window.location.href,
        hostname: window.location.hostname
      });

      // Hardcoded API endpoint
      const apiEndpoint = 'https://plankton-app-jrxs6.ondigitalocean.app/api/registrations';
      
      console.log('Using API endpoint:', apiEndpoint);
      
      if (!showPaymentUpload) {
        // First step - create registration
        console.log('Submitting registration - Step 1: Initial registration');
        
        try {
          // Added timeout to prevent hanging requests
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
          
          response = await fetch(apiEndpoint, {
            method: 'POST',
            body: formData,
            signal: controller.signal,
            credentials: 'same-origin'
          });
          
          clearTimeout(timeoutId);
          
        } catch (fetchError: unknown) {
          console.error('Fetch error:', fetchError);
          if (fetchError instanceof Error && fetchError.name === 'AbortError') {
            throw new Error('Request timed out. Please try again later.');
          }
          throw new Error('Network error: ' + ((fetchError as Error)?.message || 'Failed to connect to server'));
        }
      } else {
        // Update with payment
        const registrationId = localStorage.getItem('registrationId');
        
        // Check if we have a valid ID
        if (!registrationId || registrationId === 'unknown') {
          console.error('Invalid registration ID:', registrationId);
          notification.error({
            message: 'Registration Error',
            description: 'Could not find your registration. Please try registering again.',
            placement: 'topRight',
            duration: 5
          });
          setIsLoading(false);
          return;
        }
        
        formData.append('id', registrationId);
        console.log('Submitting registration - Step 2: Payment update for ID:', registrationId);
        
        try {
          // Try using XMLHttpRequest which may handle file uploads better
          response = await new Promise<Response>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            xhr.onreadystatechange = function() {
              if (xhr.readyState === 4) {
                console.log('XHR Response:', {
                  status: xhr.status,
                  statusText: xhr.statusText,
                  responseText: xhr.responseText,
                  responseType: xhr.responseType,
                  responseURL: xhr.responseURL
                });
                
                // Create a Response object to match the fetch API
                const responseHeaders = new Headers();
                const headerString = xhr.getAllResponseHeaders();
                const headerPairs = headerString.trim().split(/[\r\n]+/);
                
                headerPairs.forEach(line => {
                  const parts = line.split(': ');
                  const header = parts.shift();
                  const value = parts.join(': ');
                  if (header) responseHeaders.append(header, value);
                });
                
                const responseObj = new Response(xhr.responseText, {
                  status: xhr.status,
                  statusText: xhr.statusText,
                  headers: responseHeaders
                });
                
                if (xhr.status >= 200 && xhr.status < 300) {
                  resolve(responseObj);
                } else {
                  reject(responseObj);
                }
              }
            };
            
            // Force the full URL to ensure no environment variable confusion
            console.log('Opening XHR with endpoint:', window.location.origin + `/api/update-registration/${registrationId}`);
            xhr.open('POST', `/api/update-registration/${registrationId}`);
            xhr.withCredentials = true;
            
            // Do not set Content-Type, let the browser set it with the boundary
            xhr.send(formData);
          });
          
        } catch (fetchError: unknown) {
          console.error('Fetch error:', fetchError);
          throw new Error('Network error: ' + ((fetchError as Error)?.message || 'Failed to connect to server'));
        }
      }
      
      console.log('API response status:', response.status);
      console.log('API response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        console.log('Error response content type:', contentType);
        
        let errorMessage = 'Failed to process registration';
        
        try {
          // Get detailed error information
          console.log('Detailed error response:');
          console.log('- Status:', response.status);
          console.log('- Status Text:', response.statusText);
          console.log('- URL:', response.url);
          console.log('- Headers:', Object.fromEntries(response.headers.entries()));
          
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            console.log('- Error JSON data:', errorData);
            errorMessage = errorData.error || errorData.message || errorMessage;
          } else {
            // Try to get response text if not JSON
            const errorText = await response.text();
            console.log('- Error Text:', errorText);
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        
        throw new Error(errorMessage);
      }
      
      try {
        responseData = await response.json();
        console.log('API response data:', responseData);
        
        // Verify we have a valid ID
        if (!responseData.id || responseData.id === 'unknown') {
          console.error('Invalid ID received from the server:', responseData.id);
          throw new Error('Server returned an invalid registration ID. Please try again later.');
        }
        
      } catch (jsonError) {
        console.error('Error parsing response JSON:', jsonError);
        // Use a default response if JSON parsing fails
        throw new Error('Could not process server response. Please try again.');
      }
      
      // Save registration ID for later update
      if (!showPaymentUpload && responseData.id) {
        localStorage.setItem('registrationId', responseData.id);
      }
      
      setIsLoading(false);
      
      if (!showPaymentUpload) {
        // First step completed, show payment screen
        setShowPaymentUpload(true);
        setCurrentStep(0); // Reset to payment step
        
        notification.success({
          message: 'Information Saved',
          description: 'Your information has been saved. Please proceed with payment.',
          placement: 'topRight',
          duration: 5
        });
      } else {
        // Final submission with payment
        onSuccess();
        
        notification.success({
          message: 'Registration Successful',
          description: 'Thank you for registering for our psychology workshop! We will contact you soon with more details.',
          placement: 'topRight',
          duration: 5
        });
        
        // Add additional confirmation message
        notification.info({
          message: 'Confirmation',
          description: `Your registration (ID: ${responseData.id}) has been received. An email confirmation with WhatsApp access details will be sent to ${data.email}.`,
          placement: 'topRight',
          duration: 10
        });
        
        // Clear local storage
        localStorage.removeItem('registrationId');
        
        reset();
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
        setShowPaymentUpload(false);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setIsLoading(false);
      
      notification.error({
        message: 'Registration Failed',
        description: error instanceof Error ? error.message : 'There was an error submitting your registration. Please try again.',
        placement: 'topRight',
        duration: 5
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (info: FileInfo) => {
    if (info.file && (info.file.status === 'done' || info.file.status === 'uploading')) {
      const uploadedFile = info.file.originFileObj;
      if (uploadedFile) {
        setPreviewUrl(URL.createObjectURL(uploadedFile));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
      <Title level={2} style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#722ed1' }}>
        Workshop Registration
      </Title>
      
      {showPaymentUpload ? (
        // Payment section
        <div>
          <Steps
            current={currentStep}
            items={[
              {
                title: 'Make Payment',
                description: 'Pay via UPI'
              },
              {
                title: 'Upload Screenshot',
                description: 'Submit proof of payment'
              }
            ]}
            style={{ marginBottom: '2rem' }}
          />
          
          {currentStep === 0 && (
            <div className="payment-step">
              <PaymentButton onInstruct={handlePaymentInstructed} />
              <Paragraph style={{ textAlign: 'center', marginBottom: '1rem' }}>
                Please make payment using the button above.
              </Paragraph>
            </div>
          )}
          
          {currentStep === 1 && (
            <div className="form-section payment-section">
              <div className="section-header">
                <div className="section-icon">
                  <UploadOutlined />
                </div>
                <Title level={4} style={{ margin: '12px 0 0' }}>Payment Verification</Title>
              </div>
              
              <Form.Item 
                label={
                  <div className="form-label">
                    <span className="required-dot">*</span>
                    <span className="label-text">Payment Screenshot</span>
                  </div>
                }
                extra="Please upload a screenshot of your payment confirmation"
              >
                <Controller
                  name="paymentScreenshot"
                  control={control}
                  rules={{ 
                    required: "Payment screenshot is required",
                    validate: value => {
                      if (!value || value.length === 0) {
                        return "Please upload a payment screenshot";
                      }
                      
                      if (value[0] && value[0].size) {
                        const sizeInMB = value[0].size / (1024 * 1024);
                        if (sizeInMB > 5) {
                          return "File size should not exceed 5MB";
                        }
                      }
                      
                      if (value[0] && value[0].type) {
                        const acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
                        if (!acceptedTypes.includes(value[0].type)) {
                          return "Only image files (PNG, JPEG, GIF) are allowed";
                        }
                      }
                      
                      return true;
                    }
                  }}
                  render={({ field }) => (
                    <Upload
                      name="paymentScreenshot"
                      listType="picture-card"
                      maxCount={1}
                      accept="image/*"
                      onChange={(info) => {
                        field.onChange(info.fileList.length ? info.fileList[0] : null);
                        handleFileChange(info);
                      }}
                      beforeUpload={() => false}
                      showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
                      className="styled-upload"
                    >
                      <div className="upload-button">
                        <UploadOutlined style={{ fontSize: 24, color: '#722ed1' }} />
                        <div style={{ marginTop: 8, color: '#722ed1' }}>Upload</div>
                      </div>
                    </Upload>
                  )}
                />
                {errors.paymentScreenshot && <div className="ant-form-item-explain-error">{errors.paymentScreenshot.message}</div>}
              </Form.Item>
              
              <Button 
                type="primary" 
                htmlType="submit"
                size="large"
                loading={isLoading}
                block
                className="submit-button"
                icon={<CheckCircleOutlined />}
              >
                Complete Registration
              </Button>
            </div>
          )}
        </div>
      ) : (
        // Original registration form
        <>
          <div className="form-sections-wrapper">
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon">
                  <UserOutlined />
                </div>
                <Title level={4} style={{ margin: '12px 0 0' }}>Personal Details</Title>
              </div>
              
              <Form.Item 
                label={
                  <div className="form-label">
                    <span className="required-dot">*</span>
                    <span className="label-text">Full Name</span>
                  </div>
                }
              >
                <Controller
                  name="name"
                  control={control}
                  rules={{ 
                    required: "Please enter your full name", 
                    minLength: { value: 3, message: "Name must be at least 3 characters" },
                    maxLength: { value: 50, message: "Name must not exceed 50 characters" },
                    pattern: { value: /^[a-zA-Z\s]+$/, message: "Name must only contain letters and spaces" }
                  }}
                  render={({ field }) => (
                    <Input 
                      {...field} 
                      placeholder="Enter your full name" 
                      prefix={<UserOutlined className="input-icon" />}
                      size="large"
                      className="styled-input"
                      status={errors.name ? "error" : ""}
                    />
                  )}
                />
                {errors.name && <div className="ant-form-item-explain-error">{errors.name.message}</div>}
              </Form.Item>

              <Form.Item 
                label={
                  <div className="form-label">
                    <span className="required-dot">*</span>
                    <span className="label-text">Email Address</span>
                  </div>
                }
              >
                <Controller
                  name="email"
                  control={control}
                  rules={{ 
                    required: "Please enter your email address",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address"
                    },
                    maxLength: { value: 100, message: "Email must not exceed 100 characters" }
                  }}
                  render={({ field }) => (
                    <Input 
                      {...field} 
                      placeholder="Enter your email address" 
                      prefix={<MailOutlined className="input-icon" />}
                      size="large"
                      className="styled-input"
                      status={errors.email ? "error" : ""}
                    />
                  )}
                />
                {errors.email && <div className="ant-form-item-explain-error">{errors.email.message}</div>}
              </Form.Item>

              <Form.Item 
                label={
                  <div className="form-label">
                    <span className="required-dot">*</span>
                    <span className="label-text">Phone Number</span>
                  </div>
                }
                style={{ marginBottom: '20px', borderTop: '1px dashed #e8e8e8', paddingTop: '15px' }}
              >
                <Controller
                  name="phone"
                  control={control}
                  rules={{ 
                    required: "Please enter your phone number",
                    pattern: { 
                      value: /^[0-9+-\s]{7,15}$/, 
                      message: "Please enter a valid phone number (7-15 digits)" 
                    },
                    minLength: { value: 7, message: "Phone number must be at least 7 digits" },
                    maxLength: { value: 15, message: "Phone number must not exceed 15 digits" }
                  }}
                  render={({ field }) => (
                    <Input 
                      {...field} 
                      placeholder="Enter your phone number" 
                      prefix={<PhoneOutlined className="input-icon" />}
                      size="large"
                      className="styled-input"
                      status={errors.phone ? "error" : ""}
                      style={{ borderColor: '#722ed1', backgroundColor: '#faf5ff' }}
                    />
                  )}
                />
                {errors.phone && <div className="ant-form-item-explain-error">{errors.phone.message}</div>}
              </Form.Item>

              <Form.Item 
                label={
                  <div className="form-label">
                    <span className="required-dot">*</span>
                    <span className="label-text">Age</span>
                  </div>
                }
              >
                <Controller
                  name="age"
                  control={control}
                  rules={{ 
                    required: "Please enter your age",
                    min: { value: 18, message: "You must be at least 18 years old" },
                    max: { value: 100, message: "Please enter a valid age" },
                    validate: value => {
                      if (value === null || value === undefined || isNaN(Number(value))) {
                        return "Age must be a valid number";
                      }
                      if (!Number.isInteger(Number(value))) {
                        return "Age must be a whole number";
                      }
                      return true;
                    }
                  }}
                  render={({ field }) => (
                    <Input 
                      {...field} 
                      placeholder="Your age" 
                      type="number"
                      min={18}
                      max={100}
                      style={{ width: '100%' }}
                      size="large"
                      className="styled-input"
                      prefix={<NumberOutlined className="input-icon" />}
                      status={errors.age ? "error" : ""}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        field.onChange(isNaN(value) ? undefined : value);
                      }}
                      onBlur={field.onBlur}
                    />
                  )}
                />
                {errors.age && <div className="ant-form-item-explain-error">{errors.age.message}</div>}
              </Form.Item>
            </div>

            <div className="form-section">
              <div className="section-header">
                <div className="section-icon">
                  <CalendarOutlined />
                </div>
                <Title level={4} style={{ margin: '12px 0 0' }}>Workshop Preferences</Title>
              </div>
              
              <Form.Item 
                label={
                  <div className="form-label">
                    <span className="required-dot">*</span>
                    <span className="label-text">Area of Interest in Psychology</span>
                  </div>
                }
                tooltip="Choose the area you're most interested in learning about"
              >
                <Controller
                  name="interestArea"
                  control={control}
                  rules={{ 
                    required: "Please select an area of interest",
                    validate: value => {
                      const validOptions = ["clinical", "cognitive", "developmental", "social", "counseling", "educational", "industrial", "other"];
                      return validOptions.includes(value) || "Please select a valid option";
                    }
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Select your area of interest"
                      size="large"
                      className="styled-select"
                      suffixIcon={<InfoCircleOutlined className="input-icon" />}
                      popupClassName="select-dropdown"
                      dropdownStyle={{ borderRadius: '12px' }}
                      status={errors.interestArea ? "error" : ""}
                    >
                      <Option value="clinical">Clinical Psychology</Option>
                      <Option value="cognitive">Cognitive Psychology</Option>
                      <Option value="developmental">Developmental Psychology</Option>
                      <Option value="social">Social Psychology</Option>
                      <Option value="counseling">Counseling Psychology</Option>
                      <Option value="educational">Educational Psychology</Option>
                      <Option value="industrial">Industrial-Organizational Psychology</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  )}
                />
                {errors.interestArea && <div className="ant-form-item-explain-error">{errors.interestArea.message}</div>}
              </Form.Item>

              <Form.Item 
                label={
                  <div className="form-label">
                    <span className="required-dot">*</span>
                    <span className="label-text">Preferred Timing for Sessions</span>
                  </div>
                }
              >
                <Controller
                  name="preferredTiming"
                  control={control}
                  rules={{ 
                    required: "Please select your preferred timing",
                    validate: value => {
                      const validTimes = ["morning", "afternoon", "evening"];
                      return validTimes.includes(value) || "Please select a valid time slot";
                    }
                  }}
                  render={({ field }) => (
                    <div>
                      <Paragraph style={{ marginBottom: '1rem', color: '#722ed1', fontWeight: 'bold' }}>
                        Workshop Dates: 5th May to 30th May
                      </Paragraph>
                      <Radio.Group 
                        {...field}
                        className="styled-radio-group"
                      >
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Radio value="morning" className="styled-radio">Morning (10 AM - 12 PM)</Radio>
                          <Radio value="afternoon" className="styled-radio">Afternoon (4 PM - 6 PM)</Radio>
                          <Radio value="evening" className="styled-radio">Evening (5 PM - 7 PM)</Radio>
                        </Space>
                      </Radio.Group>
                    </div>
                  )}
                />
                {errors.preferredTiming && <div className="ant-form-item-explain-error">{errors.preferredTiming.message}</div>}
              </Form.Item>
            </div>
          </div>

          <div className="form-section expectations-section">
            <div className="section-header">
              <div className="section-icon">
                <BulbOutlined />
              </div>
              <Title level={4} style={{ margin: '12px 0 0' }}>Expectations & Additional Information</Title>
            </div>
            
            <Form.Item 
              label={
                <div className="form-label">
                  <span className="label-text">What do you expect to learn from this workshop?</span>
                </div>
              }
            >
              <Controller
                name="expectations"
                control={control}
                rules={{
                  maxLength: { value: 500, message: "Must not exceed 500 characters" },
                  validate: value => {
                    if (value && value.trim().length < 10 && value.trim().length > 0) {
                      return "If provided, expectations should be at least 10 characters";
                    }
                    return true;
                  }
                }}
                render={({ field }) => (
                  <Input.TextArea 
                    {...field} 
                    placeholder="Share your expectations..." 
                    rows={4}
                    maxLength={500}
                    showCount
                    className="styled-textarea"
                    status={errors.expectations ? "error" : ""}
                  />
                )}
              />
              {errors.expectations && <div className="ant-form-item-explain-error">{errors.expectations.message}</div>}
            </Form.Item>

            <Form.Item 
              label={
                <div className="form-label">
                  <span className="required-dot">*</span>
                  <span className="label-text">How did you hear about us?</span>
                </div>
              }
            >
              <Controller
                name="referralSource"
                control={control}
                rules={{ 
                  required: "Please tell us how you heard about us",
                  validate: value => {
                    const validSources = ["social", "friend", "search", "email", "other"];
                    return validSources.includes(value) || "Please select a valid referral source";
                  }
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select referral source"
                    size="large"
                    className="styled-select"
                    suffixIcon={<InfoCircleOutlined className="input-icon" />}
                    status={errors.referralSource ? "error" : ""}
                  >
                    <Option value="social">Social Media</Option>
                    <Option value="friend">Friend or Colleague</Option>
                    <Option value="search">Search Engine</Option>
                    <Option value="email">Email Newsletter</Option>
                    <Option value="other">Other</Option>
                  </Select>
                )}
              />
              {errors.referralSource && <div className="ant-form-item-explain-error">{errors.referralSource.message}</div>}
            </Form.Item>
          </div>

          <Button 
            type="primary" 
            htmlType="submit"
            size="large"
            loading={isLoading}
            block
            className="submit-button"
            icon={<CheckCircleOutlined />}
          >
            Continue to Payment
          </Button>
        </>
      )}
    </form>
  );
} 
