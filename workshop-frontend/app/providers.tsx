'use client';

import React from 'react';
import { StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider } from 'antd';

export default function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <StyleProvider hashPriority="high">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#722ed1',
            colorInfo: '#722ed1',
            colorLink: '#722ed1',
            colorSuccess: '#52c41a',
            colorWarning: '#faad14',
            colorError: '#ff4d4f',
            borderRadius: 8,
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          },
          components: {
            Button: {
              colorPrimary: '#722ed1',
              algorithm: true,
            },
            Input: {
              colorPrimary: '#722ed1',
              algorithm: true,
            },
            Select: {
              colorPrimary: '#722ed1',
              algorithm: true,
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </StyleProvider>
  );
} 