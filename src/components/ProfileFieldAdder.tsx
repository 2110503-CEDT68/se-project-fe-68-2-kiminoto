import { useState } from 'react';

interface ProfileField {
  id: number;
  type: string;
  value: string;
}

const fieldTypes = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'line', label: 'LINE' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'website', label: 'Website' },
  { value: 'phone', label: 'Phone' },
  { value: 'email', label: 'Email' },
];

export default function ProfileFieldAdder() {
  const [fields, setFields] = useState<ProfileField[]>([]);
  const [fieldType, setFieldType] = useState('facebook');
  const [fieldValue, setFieldValue] = useState('');

  const handleAdd = () => {
    if (!fieldValue.trim()) return;
    
    const newField: ProfileField = {
      id: Date.now(),
      type: fieldType,
      value: fieldValue.trim(),
    };
    
    setFields([...fields, newField]);
    setFieldValue('');
  };

  const handleRemove = (id: number) => {
    setFields(fields.filter(field => field.id !== id));
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#fff', 
      borderRadius: '8px',
      border: '1px solid #ddd',
      maxWidth: '500px'
    }}>
      <h3 style={{ margin: '0 0 15px 0' }}>Add Profile Field</h3>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <select 
          value={fieldType} 
          onChange={(e) => setFieldType(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '14px',
            minWidth: '120px'
          }}
        >
          {fieldTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        
        <input 
          type="text"
          value={fieldValue}
          onChange={(e) => setFieldValue(e.target.value)}
          placeholder="Enter value..."
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '14px'
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
        
        <button 
          onClick={handleAdd}
          disabled={!fieldValue.trim()}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: fieldValue.trim() ? '#0070f3' : '#ccc',
            color: '#fff',
            fontSize: '14px',
            cursor: fieldValue.trim() ? 'pointer' : 'not-allowed'
          }}
        >
          Add
        </button>
      </div>

      {fields.length > 0 && (
        <div style={{ marginTop: '15px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
            Added Fields ({fields.length}):
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {fields.map(field => (
              <li 
                key={field.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  marginBottom: '8px'
                }}
              >
                <span>
                  <strong>{fieldTypes.find(t => t.value === field.type)?.label}:</strong> {field.value}
                </span>
                <button 
                  onClick={() => handleRemove(field.id)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}