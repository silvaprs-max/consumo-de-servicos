import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Card } from '../UI/Card';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

const ChartsSection = ({ entries, year }) => {
    const yearEntries = entries.filter(e => parseInt(e.year) === parseInt(year));

    // Process data for Line Chart (Monthly Consumption Evolution)
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const monthLabels = months.map(m => new Date(0, m - 1).toLocaleString('pt-BR', { month: 'short' }));

    const getServiceConsumption = (service) => {
        return months.map(m => {
            const entry = yearEntries.find(e => e.service === service && parseInt(e.month) === m);
            return entry ? parseFloat(entry.value) : 0;
        });
    };

    const lineChartData = {
        labels: monthLabels,
        datasets: [
            {
                label: 'Energia (kWh)',
                data: getServiceConsumption('energy'),
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.5)',
                tension: 0.3,
                yAxisID: 'y',
            },
            {
                label: 'Água (m³)',
                data: getServiceConsumption('water'),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.3,
                yAxisID: 'y1',
            },
            {
                label: 'Gás (m³)',
                data: getServiceConsumption('gas'),
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
                tension: 0.3,
                yAxisID: 'y1',
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Evolução Mensal do Consumo' },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y;
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: { display: true, text: 'Energia (kWh)' },
                beginAtZero: true
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: { display: true, text: 'Água/Gás (m³)' },
                beginAtZero: true,
                grid: {
                    drawOnChartArea: false,
                },
            },
        }
    };

    // Process data for Doughnut Chart (Cost Distribution)
    const totalByService = {
        energy: yearEntries.filter(e => e.service === 'energy').reduce((acc, curr) => acc + parseFloat(curr.cost), 0),
        water: yearEntries.filter(e => e.service === 'water').reduce((acc, curr) => acc + parseFloat(curr.cost), 0),
        gas: yearEntries.filter(e => e.service === 'gas').reduce((acc, curr) => acc + parseFloat(curr.cost), 0),
    };

    const totalCost = totalByService.energy + totalByService.water + totalByService.gas;

    const getPercentage = (value) => {
        if (totalCost === 0) return 0;
        return ((value / totalCost) * 100).toFixed(1);
    };

    const doughnutData = {
        labels: ['Energia', 'Água', 'Gás'],
        datasets: [
            {
                data: [totalByService.energy, totalByService.water, totalByService.gas],
                backgroundColor: [
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
                borderColor: [
                    '#f59e0b',
                    '#3b82f6',
                    '#ef4444',
                ],
                borderWidth: 1,
            },
        ],
    };

    const doughnutOptions = {
        plugins: {
            legend: {
                display: false, // Ocultar legenda padrão
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.raw;
                        const percentage = getPercentage(value);
                        return ` R$ ${value.toFixed(2)} (${percentage}%)`;
                    }
                }
            }
        },
        maintainAspectRatio: true,
    };

    // Dados para a legenda personalizada
    const legendData = [
        {
            label: 'Energia',
            color: '#f59e0b',
            value: totalByService.energy,
            percentage: getPercentage(totalByService.energy)
        },
        {
            label: 'Água',
            color: '#3b82f6',
            value: totalByService.water,
            percentage: getPercentage(totalByService.water)
        },
        {
            label: 'Gás',
            color: '#ef4444',
            value: totalByService.gas,
            percentage: getPercentage(totalByService.gas)
        }
    ];

    // 1. Gráfico de Barras - Comparação Mensal de Custos
    const getServiceCosts = (service) => {
        return months.map(m => {
            const entry = yearEntries.find(e => e.service === service && parseInt(e.month) === m);
            return entry ? parseFloat(entry.cost) : 0;
        });
    };

    const barChartData = {
        labels: monthLabels,
        datasets: [
            {
                label: 'Energia',
                data: getServiceCosts('energy'),
                backgroundColor: 'rgba(245, 158, 11, 0.8)',
                borderColor: '#f59e0b',
                borderWidth: 1,
            },
            {
                label: 'Água',
                data: getServiceCosts('water'),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: '#3b82f6',
                borderWidth: 1,
            },
            {
                label: 'Gás',
                data: getServiceCosts('gas'),
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
                borderColor: '#ef4444',
                borderWidth: 1,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Comparação Mensal de Custos' },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: R$ ${context.parsed.y.toFixed(2)}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Custo (R$)' }
            }
        }
    };

    // 2. Gráfico de Barras Horizontais - Média vs Atual (último mês com dados)
    const allEntries = entries; // Todos os lançamentos históricos
    const currentMonth = Math.max(...yearEntries.map(e => parseInt(e.month)), 0);

    const calculateAverage = (service) => {
        const serviceEntries = allEntries.filter(e => e.service === service);
        if (serviceEntries.length === 0) return 0;
        const total = serviceEntries.reduce((acc, curr) => acc + parseFloat(curr.value), 0);
        return total / serviceEntries.length;
    };

    const getCurrentValue = (service) => {
        const entry = yearEntries.find(e => e.service === service && parseInt(e.month) === currentMonth);
        return entry ? parseFloat(entry.value) : 0;
    };

    const horizontalBarData = {
        labels: ['Energia (kWh)', 'Água (m³)', 'Gás (m³)'],
        datasets: [
            {
                label: 'Média Histórica',
                data: [
                    calculateAverage('energy'),
                    calculateAverage('water'),
                    calculateAverage('gas')
                ],
                backgroundColor: 'rgba(156, 163, 175, 0.6)',
                borderColor: '#9ca3af',
                borderWidth: 1,
            },
            {
                label: `Atual (${monthLabels[currentMonth - 1] || 'N/A'})`,
                data: [
                    getCurrentValue('energy'),
                    getCurrentValue('water'),
                    getCurrentValue('gas')
                ],
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: '#22c55e',
                borderWidth: 1,
            },
        ],
    };

    const horizontalBarOptions = {
        indexAxis: 'y',
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Consumo: Média Histórica vs Atual' },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const service = context.label.includes('Energia') ? 'kWh' : 'm³';
                        return `${context.dataset.label}: ${context.parsed.x.toFixed(2)} ${service}`;
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
            }
        }
    };

    // 3. Gráfico de Área Empilhada - Custo Total Acumulado
    const areaChartData = {
        labels: monthLabels,
        datasets: [
            {
                label: 'Energia',
                data: getServiceCosts('energy'),
                backgroundColor: 'rgba(245, 158, 11, 0.6)',
                borderColor: '#f59e0b',
                borderWidth: 2,
                fill: true,
            },
            {
                label: 'Água',
                data: getServiceCosts('water'),
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: '#3b82f6',
                borderWidth: 2,
                fill: true,
            },
            {
                label: 'Gás',
                data: getServiceCosts('gas'),
                backgroundColor: 'rgba(239, 68, 68, 0.6)',
                borderColor: '#ef4444',
                borderWidth: 2,
                fill: true,
            },
        ],
    };

    const areaOptions = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Evolução Acumulada dos Custos' },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: R$ ${context.parsed.y.toFixed(2)}`;
                    }
                }
            }
        },
        scales: {
            y: {
                stacked: true,
                beginAtZero: true,
                title: { display: true, text: 'Custo (R$)' }
            },
            x: {
                stacked: true,
            }
        }
    };

    if (yearEntries.length === 0) {
        return (
            <Card>
                <div className="flex flex-col items-center justify-center h-64 text-muted">
                    <p>Nenhum dado encontrado para o ano de {year}.</p>
                    <p className="text-sm">Adicione lançamentos para visualizar os gráficos.</p>
                </div>
            </Card>
        );
    }

    return (
        <>
            {/* Primeira linha - Gráficos originais */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <Card className="col-span-2" style={{ gridColumn: 'span 2' }}>
                    <div style={{ height: '300px' }}>
                        <Line options={lineOptions} data={lineChartData} />
                    </div>
                </Card>
                <Card>
                    <h3 className="text-lg font-bold mb-4" style={{ textAlign: 'center', marginBottom: '1rem' }}>Distribuição de Gastos</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', minHeight: '280px' }}>
                        {/* Gráfico */}
                        <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ width: '100%', maxWidth: '280px' }}>
                                <Doughnut data={doughnutData} options={doughnutOptions} />
                            </div>
                        </div>

                        {/* Legenda Personalizada */}
                        <div style={{
                            flex: '0 0 auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            paddingRight: '1rem'
                        }}>
                            {legendData.map((item, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    fontSize: '0.95rem'
                                }}>
                                    {/* Indicador de cor */}
                                    <div style={{
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '4px',
                                        backgroundColor: item.color,
                                        flexShrink: 0
                                    }}></div>

                                    {/* Informações */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <div style={{
                                            fontWeight: '600',
                                            color: 'var(--text-primary)'
                                        }}>
                                            {item.label}
                                        </div>
                                        <div style={{
                                            fontSize: '1.25rem',
                                            fontWeight: '700',
                                            color: item.color
                                        }}>
                                            {item.percentage}%
                                        </div>
                                        <div style={{
                                            fontSize: '0.85rem',
                                            color: 'var(--text-muted)'
                                        }}>
                                            R$ {item.value.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Segunda seção - Novos gráficos analíticos */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* Gráfico de Barras - Comparação Mensal de Custos */}
                <Card className="col-span-full" style={{ gridColumn: '1 / -1' }}>
                    <div style={{ height: '320px' }}>
                        <Bar options={barOptions} data={barChartData} />
                    </div>
                </Card>

                {/* Gráfico de Barras Horizontais - Média vs Atual */}
                <Card>
                    <div style={{ height: '280px' }}>
                        <Bar options={horizontalBarOptions} data={horizontalBarData} />
                    </div>
                </Card>

                {/* Gráfico de Área Empilhada - Custo Total Acumulado */}
                <Card>
                    <div style={{ height: '280px' }}>
                        <Line options={areaOptions} data={areaChartData} />
                    </div>
                </Card>
            </div>
        </>
    );
};

export default ChartsSection;
