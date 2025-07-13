'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

type HealthStatus = 'checking' | 'healthy' | 'unhealthy';

export default function HealthStatus() {
  const [status, setStatus] = useState<HealthStatus>('checking');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/health`,
          {
            timeout: 5000,  
            headers: {
              'Accept': 'application/json',
            }
          }
        );
        setStatus(response.data.status === 'UP' ? 'healthy' : 'unhealthy');
      } catch (error) {
        console.error('Health check failed:', error);
        setStatus('unhealthy');
      }
    };

    checkHealth();
    
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  const statusColors = {
    checking: 'bg-yellow-500',
    healthy: 'bg-green-500',
    unhealthy: 'bg-red-500',
  };

  const statusText = {
    checking: 'Checking...',
    healthy: 'Healthy',
    unhealthy: 'Unhealthy'
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${statusColors[status]} animate-pulse`} />
      <span className="text-sm text-gray-600">
        API Status: {statusText[status]}
      </span>
    </div>
  );
}