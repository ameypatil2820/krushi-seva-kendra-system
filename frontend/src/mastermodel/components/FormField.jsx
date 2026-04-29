import React from 'react';

const FormField = ({ label, name, type = 'text', value, onChange, placeholder, required, options, isToggle }) => {
  if (isToggle) {
    return (
      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <input 
          type="checkbox" 
          name={name}
          checked={value}
          onChange={e => onChange({ target: { name, value: e.target.checked } })}
          style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#16a34a' }}
        />
        <label style={{ margin: 0 }}>{label}</label>
      </div>
    );
  }

  return (
    <div className="form-group">
      <label>{label} {required && <span style={{ color: 'red' }}>*</span>}</label>
      {type === 'select' ? (
        <select 
          className="form-control" 
          name={name} 
          value={value} 
          onChange={onChange}
          required={required}
        >
          <option value="">Select {label}</option>
          {options?.map((opt, i) => (
            <option key={i} value={opt.id || opt.value}>{opt.name || opt.label}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea 
          className="form-control" 
          name={name} 
          value={value} 
          onChange={onChange} 
          placeholder={placeholder}
          required={required}
          rows={3}
        />
      ) : (
        <input 
          type={type} 
          className="form-control" 
          name={name} 
          value={value} 
          onChange={onChange} 
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
};

export default FormField;
