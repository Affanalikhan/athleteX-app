import React from 'react';
import { Box } from '@mui/material';

interface SportyBackgroundProps {
  children: React.ReactNode;
  variant?: 'gradient' | 'pattern' | 'minimal';
}

const SportyBackground: React.FC<SportyBackgroundProps> = ({ 
  children, 
  variant = 'gradient' 
}) => {
  const getBackgroundStyle = () => {
    switch (variant) {
      case 'pattern':
        return {
          background: `
            linear-gradient(
              135deg,
              rgba(10, 10, 10, 0.95) 0%,
              rgba(0, 245, 255, 0.05) 50%,
              rgba(138, 43, 226, 0.05) 100%
            ),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300f5ff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `
        };
      case 'minimal':
        return {
          background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.98) 0%, rgba(0, 245, 255, 0.02) 100%)'
        };
      default:
        return {
          background: `
            linear-gradient(
              135deg,
              rgba(10, 10, 10, 0.95) 0%,
              rgba(0, 245, 255, 0.1) 50%,
              rgba(138, 43, 226, 0.1) 100%
            ),
            radial-gradient(
              ellipse at center,
              rgba(0, 245, 255, 0.1) 0%,
              transparent 70%
            )
          `
        };
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        ...getBackgroundStyle()
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300f5ff' fill-opacity='0.01'%3E%3Cpath d='M50 50m-20 0a20 20 0 1 1 40 0a20 20 0 1 1-40 0'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `,
          opacity: 0.3,
          animation: 'float 20s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' }
          }
        }}
      />
      
      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export default SportyBackground;
