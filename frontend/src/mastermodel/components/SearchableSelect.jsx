import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiChevronDown, FiX } from 'react-icons/fi';

const SearchableSelect = ({ label, options, value, onChange, placeholder, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // Update search term when value changes (e.g. on edit)
  useEffect(() => {
    if (value) setSearchTerm(value);
  }, [value]);

  const filteredOptions = options.filter(opt => 
    String(opt).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (opt) => {
    setSearchTerm(opt);
    onChange({ target: { name: label.toLowerCase(), value: opt } });
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    setSearchTerm('');
    onChange({ target: { name: label.toLowerCase(), value: '' } });
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredOptions.length) {
        handleSelect(filteredOptions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="form-group" style={{ position: 'relative' }} ref={wrapperRef}>
      <label>{label} {required && <span style={{ color: 'red' }}>*</span>}</label>
      
      <div 
        style={{ 
          position: 'relative', 
          display: 'flex', 
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={() => setIsOpen(true)}
      >
        <input
          type="text"
          className="form-control"
          placeholder={placeholder || `Select ${label}`}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          required={required}
          style={{ paddingRight: '60px' }}
        />
        
        <div style={{ position: 'absolute', right: '10px', display: 'flex', gap: '8px', alignItems: 'center', color: '#9ca3af' }}>
          {searchTerm && <FiX onClick={(e) => { e.stopPropagation(); handleClear(); }} style={{ cursor: 'pointer' }} />}
          <FiChevronDown />
        </div>
      </div>

      {isOpen && searchTerm && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          marginTop: '4px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, i) => (
              <div 
                key={i}
                onClick={() => handleSelect(opt)}
                style={{
                  padding: '10px 15px',
                  cursor: 'pointer',
                  borderBottom: i === filteredOptions.length - 1 ? 'none' : '1px solid #f3f4f6',
                  background: selectedIndex === i ? '#f0fdf4' : (value === opt ? '#f9fafb' : 'transparent'),
                  color: selectedIndex === i || value === opt ? '#16a34a' : '#374151',
                  fontWeight: selectedIndex === i || value === opt ? '600' : '400'
                }}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                {opt}
              </div>
            ))
          ) : (
            <div style={{ padding: '15px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
              No results found for "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
