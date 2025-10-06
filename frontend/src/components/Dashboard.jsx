import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BRANDS = ['Nike', 'Adidas', 'Apple', 'Samsung', 'Coca-Cola'];
const API_URL = 'http://localhost:3001/api/mentions';

// NUEVO: Un componente simple para el spinner de carga
const LoadingSpinner = () => <div className="spinner"></div>;

const Dashboard = () => {
  const [mentions, setMentions] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // NUEVO: Estado para manejar errores

  useEffect(() => {
    const fetchMentions = async () => {
      setLoading(true);
      setError(null); // Limpiamos errores anteriores
      try {
        const url = selectedBrand ? `${API_URL}?brand=${selectedBrand}` : API_URL;
        const response = await axios.get(url);
        setMentions(response.data);
      } catch (err) {
        console.error("Error al obtener las menciones:", err);
        setError("No se pudieron cargar los datos. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchMentions();
  }, [selectedBrand]);

  // NUEVO: Usamos useMemo para calcular los KPIs solo cuando las menciones cambian
  const kpis = useMemo(() => {
    const total = mentions.length;
    if (total === 0) return { total: 0, positive: 0, negative: 0 };

    const positiveCount = mentions.filter(m => m.sentiment === 'positive').length;
    const negativeCount = mentions.filter(m => m.sentiment === 'negative').length;
    
    return {
      total,
      positive: ((positiveCount / total) * 100).toFixed(1),
      negative: ((negativeCount / total) * 100).toFixed(1),
    };
  }, [mentions]);

  const chartData = useMemo(() => {
    const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
    mentions.forEach(mention => {
      sentimentCounts[mention.sentiment]++;
    });
    return {
      labels: ['Positivo', 'Negativo', 'Neutral'],
      datasets: [{
        label: 'Conteo de Sentimientos',
        data: [sentimentCounts.positive, sentimentCounts.negative, sentimentCounts.neutral],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(201, 203, 207, 0.6)'],
        borderColor: ['#4BC0C0', '#FF6384', '#CCCCCC'],
        borderWidth: 1,
      }],
    };
  }, [mentions]);

  const renderContent = () => {
    if (loading) return <LoadingSpinner />;
    if (error) return <p className="error-message">{error}</p>;
    if (mentions.length === 0) return <p className="empty-message">No se encontraron menciones para esta marca.</p>;
    
    return (
      <>
        <div className="chart-container">
          <h2>Resumen de Sentimientos</h2>
          <Bar data={chartData} options={{ responsive: true }} />
        </div>
        <div className="mentions-container">
          <h2>Últimas Menciones</h2>
          <ul className="mentions-list">
            {mentions.map(mention => (
              <li key={mention.id} className={`mention-item sentiment-${mention.sentiment}`}>
                <span className="mention-brand">{mention.brand_name}</span>
                <p>{mention.mention_text}</p>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Plataforma de Análisis de Sentimiento</h1>
      </header>
      
      <section className="controls">
        <label htmlFor="brand-select">Selecciona una Marca:</label>
        <select id="brand-select" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} disabled={loading}>
          <option value="">-- Todas las marcas --</option>
          {BRANDS.map(brand => <option key={brand} value={brand}>{brand}</option>)}
        </select>
      </section>

      {/* NUEVO: Sección de KPIs */}
      <section className="kpi-container">
        <div className="kpi-card">
          <h3>Total de Menciones</h3>
          <p>{loading ? '...' : kpis.total}</p>
        </div>
        <div className="kpi-card positive">
          <h3>Sentimiento Positivo</h3>
          <p>{loading ? '...' : `${kpis.positive}%`}</p>
        </div>
        <div className="kpi-card negative">
          <h3>Sentimiento Negativo</h3>
          <p>{loading ? '...' : `${kpis.negative}%`}</p>
        </div>
      </section>

      <main className="dashboard-main">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;