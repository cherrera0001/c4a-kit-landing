// app/components/PricingPlans.tsx (o donde sea que llames a la API)
'use client';

import { useEffect, useState } from 'react';

interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
}

export default function PricingPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlanInfo() {
      setIsLoading(true);
      setError(null);
      try {
        // La URL debe ser relativa al dominio actual si la API está en el mismo proyecto Next.js
        const response = await fetch('/api/plan-info'); // Correcto para API en el mismo dominio
        // O si necesitas una URL absoluta (menos común para APIs internas):
        // const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
        // const response = await fetch(`${baseUrl}/api/plan-info`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setPlans(data);
      } catch (err: any) {
        console.error('Failed to fetch plan info:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPlanInfo();
  }, []);

  if (isLoading) return <p>Cargando planes...</p>;
  if (error) return <p style={{ color: 'red' }}>Error al cargar planes: {error}</p>;
  if (!plans.length) return <p>No hay planes disponibles en este momento.</p>;

  return (
    <div>
      <h2>Nuestros Planes</h2>
      {plans.map(plan => (
        <div key={plan.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{plan.name}</h3>
          <p>Precio: {plan.price}</p>
          <ul>
            {plan.features.map(feature => <li key={feature}>{feature}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}
