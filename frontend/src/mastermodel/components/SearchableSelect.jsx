import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

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

  const filteredOptions = searchTerm 
    ? options.filter(opt => String(opt).toLowerCase().includes(searchTerm.toLowerCase()))
    : options.slice(0, 4);

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
    <div className="form-group" style={{ position: 'relative', marginBottom: '20px' }} ref={wrapperRef}>
      <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{label} {required && <span style={{ color: 'red' }}>*</span>}</span>
      </label>
      
      <div 
        style={{ 
          position: 'relative', 
          display: 'flex', 
          alignItems: 'center'
        }}
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
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          required={required}
          style={{ 
            paddingRight: '60px', 
            height: '45px', 
            borderRadius: '10px',
            border: isOpen ? '2px solid #16a34a' : '1px solid #e5e7eb',
            transition: 'all 0.2s',
            cursor: 'text'
          }}
        />
        
        <div 
          onClick={() => setIsOpen(!isOpen)}
          style={{ 
            position: 'absolute', 
            right: '12px', 
            display: 'flex', 
            gap: '8px', 
            alignItems: 'center', 
            color: isOpen ? '#16a34a' : '#9ca3af',
            cursor: 'pointer'
          }}
        >
          {searchTerm && <X size={16} onClick={(e) => { e.stopPropagation(); handleClear(); }} style={{ cursor: 'pointer' }} />}
          <ChevronDown size={20} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </div>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '10px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          maxHeight: '220px',
          overflowY: 'auto',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, i) => (
              <div 
                key={i}
                onClick={() => handleSelect(opt)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderBottom: i === filteredOptions.length - 1 ? 'none' : '1px solid #f9fafb',
                  background: selectedIndex === i ? '#f0fdf4' : (value === opt ? '#f9fafb' : 'transparent'),
                  color: selectedIndex === i || value === opt ? '#16a34a' : '#374151',
                  fontWeight: selectedIndex === i || value === opt ? '600' : '400',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: value === opt ? '#16a34a' : 'transparent' }}></div>
                {opt}
              </div>
            ))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
              <Search size={20} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.5 }} />
              No results found for "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
