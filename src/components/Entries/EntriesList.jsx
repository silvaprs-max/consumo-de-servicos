import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { Edit2, Trash2, Filter } from 'lucide-react';
import { Select } from '../UI/Select';

import { useToast } from '../../context/ToastContext';

const EntriesList = ({ onEdit }) => {
    const { entries, deleteEntry } = useData();
    const { addToast } = useToast();
    const [filterService, setFilterService] = useState('all');
    const [filterYear, setFilterYear] = useState(new Date().getFullYear());

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja excluir este lançamento?')) {
            deleteEntry(id);
            addToast('Lançamento excluído com sucesso!', 'success');
        }
    };

    const filteredEntries = entries.filter(entry => {
        const matchService = filterService === 'all' || entry.service === filterService;
        const matchYear = !filterYear || parseInt(entry.year) === parseInt(filterYear);
        return matchService && matchYear;
    }).sort((a, b) => {
        // Sort by date desc
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
    });

    const serviceLabel = {
        energy: 'Energia',
        water: 'Água',
        gas: 'Gás'
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    const uniqueYears = [...new Set(entries.map(e => e.year))].sort((a, b) => b - a);

    return (
        <Card title="Histórico de Lançamentos">
            <div className="flex gap-4 mb-4" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <Select
                        label="Filtrar por Serviço"
                        value={filterService}
                        onChange={(e) => setFilterService(e.target.value)}
                        options={[
                            { value: 'all', label: 'Todos' },
                            { value: 'energy', label: 'Energia' },
                            { value: 'water', label: 'Água' },
                            { value: 'gas', label: 'Gás' },
                        ]}
                    />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <Select
                        label="Filtrar por Ano"
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                        options={uniqueYears.length > 0 ? uniqueYears.map(y => ({ value: y, label: y })) : [{ value: new Date().getFullYear(), label: new Date().getFullYear() }]}
                    />
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Serviço</th>
                            <th style={{ padding: '1rem' }}>Data Ref.</th>
                            <th style={{ padding: '1rem' }}>Período Leitura</th>
                            <th style={{ padding: '1rem' }}>Vencimento</th>
                            <th style={{ padding: '1rem' }}>Consumo</th>
                            <th style={{ padding: '1rem' }}>Valor</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEntries.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                    Nenhum lançamento encontrado.
                                </td>
                            </tr>
                        ) : (
                            filteredEntries.map((entry) => (
                                <tr key={entry.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.875rem',
                                            backgroundColor: entry.service === 'energy' ? 'rgba(251, 191, 36, 0.2)' :
                                                entry.service === 'water' ? 'rgba(59, 130, 246, 0.2)' :
                                                    'rgba(239, 68, 68, 0.2)',
                                            color: entry.service === 'energy' ? '#d97706' :
                                                entry.service === 'water' ? '#2563eb' :
                                                    '#dc2626'
                                        }}>
                                            {serviceLabel[entry.service]}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {new Date(0, entry.month - 1).toLocaleString('pt-BR', { month: 'long' })}/{entry.year}
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                                        {entry.readingDateStart && entry.readingDateEnd ? (
                                            <>
                                                {formatDate(entry.readingDateStart)} a {formatDate(entry.readingDateEnd)}
                                            </>
                                        ) : '-'}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {formatDate(entry.dueDate)}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {entry.value} {entry.service === 'energy' ? 'kWh' : 'm³'}
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                                        {formatCurrency(entry.cost)}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            <Button size="icon" variant="ghost" onClick={() => onEdit(entry)}>
                                                <Edit2 size={16} />
                                            </Button>
                                            <Button size="icon" variant="ghost" onClick={() => handleDelete(entry.id)} style={{ color: 'var(--color-danger)' }}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default EntriesList;
