import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Select } from '../UI/Select';
import { Card } from '../UI/Card';

import { useToast } from '../../context/ToastContext';

const EntryForm = ({ entryToEdit, onCancelEdit }) => {
    const { addEntry, updateEntry } = useData();
    const { addToast } = useToast();

    const initialFormState = {
        service: 'energy',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        value: '',
        cost: '',
        readingDateStart: '',
        readingDateEnd: '',
        dueDate: '',
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (entryToEdit) {
            setFormData(entryToEdit);
        } else {
            setFormData(initialFormState);
        }
    }, [entryToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (entryToEdit) {
            updateEntry(entryToEdit.id, formData);
            addToast('Lançamento atualizado com sucesso!', 'success');
            onCancelEdit();
        } else {
            addEntry(formData);
            addToast('Lançamento adicionado com sucesso!', 'success');
            setFormData(initialFormState);
        }
    };

    const serviceOptions = [
        { value: 'energy', label: 'Energia Elétrica' },
        { value: 'water', label: 'Água e Esgoto' },
        { value: 'gas', label: 'Gás' },
    ];

    const monthOptions = Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: new Date(0, i).toLocaleString('pt-BR', { month: 'long' })
    }));

    return (
        <Card title={entryToEdit ? 'Editar Lançamento' : 'Novo Lançamento'}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <Select
                        label="Serviço"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        options={serviceOptions}
                        required
                    />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Select
                            label="Mês"
                            name="month"
                            value={formData.month}
                            onChange={handleChange}
                            options={monthOptions}
                            className="w-full month-year-field"
                            style={{ flex: 1 }}
                            required
                        />
                        <Input
                            label="Ano"
                            name="year"
                            type="number"
                            value={formData.year}
                            onChange={handleChange}
                            min="2000"
                            max="2100"
                            className="month-year-field"
                            style={{ flex: 1 }}
                            required
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <Input
                        label="Início da Leitura"
                        name="readingDateStart"
                        type="date"
                        value={formData.readingDateStart || ''}
                        onChange={handleChange}
                    />
                    <Input
                        label="Fim da Leitura"
                        name="readingDateEnd"
                        type="date"
                        value={formData.readingDateEnd || ''}
                        onChange={handleChange}
                    />
                    <Input
                        label="Vencimento"
                        name="dueDate"
                        type="date"
                        value={formData.dueDate || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <Input
                        label={`Consumo (${formData.service === 'energy' ? 'kWh' : formData.service === 'water' ? 'm³' : 'm³'})`}
                        name="value"
                        type="number"
                        step="0.01"
                        value={formData.value}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Valor (R$)"
                        name="cost"
                        type="number"
                        step="0.01"
                        value={formData.cost}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="flex justify-end gap-2" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    {entryToEdit && (
                        <Button type="button" variant="secondary" onClick={onCancelEdit}>
                            Cancelar
                        </Button>
                    )}
                    <Button type="submit">
                        {entryToEdit ? 'Salvar Alterações' : 'Adicionar'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default EntryForm;
