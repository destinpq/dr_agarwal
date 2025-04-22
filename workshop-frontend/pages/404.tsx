import React from 'react';
import Link from 'next/link';

export default function Custom404() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        marginBottom: '1rem',
        background: 'linear-gradient(135deg, #722ed1 0%, #a855f7 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        404 - Page Not Found
      </h1>
      <p style={{ 
        fontSize: '1.2rem', 
        marginBottom: '2rem', 
        color: '#666' 
      }}>
        We couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Link href="/" style={{ 
        padding: '12px 24px',
        background: 'linear-gradient(45deg, #722ed1, #a855f7)',
        color: 'white',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 'bold',
        boxShadow: '0 4px 14px rgba(114, 46, 209, 0.25)',
        transition: 'all 0.3s ease'
      }}>
        Go back home
      </Link>
    </div>
  );
}
