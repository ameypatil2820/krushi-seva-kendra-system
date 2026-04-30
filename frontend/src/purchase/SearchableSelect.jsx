import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, ChevronDown, X } from 'lucide-react';

const SearchableSelect = ({ options, value, onChange, placeholder, style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const selectedOption = options.find(opt => String(opt.id) === String(value));

  const calcPos = () => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        const dropdown = document.getElementById('searchable-dropdown-portal');
        if (dropdown && dropdown.contains(event.target)) return;
        setIsOpen(false);
        setSearchTerm('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    calcPos();
    const onScroll = () => calcPos();
    const onResize = () => calcPos();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [isOpen]);

  const filteredOptions = options.filter(opt =>
    (opt.name && opt.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (opt.city && opt.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (opt.code && opt.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpen = () => {
    calcPos();
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const dropdown = isOpen ? createPortal(
    <div
      id="searchable-dropdown-portal"
      style={{
        position: 'absolute',
        top: dropdownPos.top,
        left: dropdownPos.left,
        width: dropdownPos.width,
        zIndex: 99999,
        maxHeight: '260px',
        overflowY: 'auto',
        boxShadow: '0 15px 40px rgba(0,0,0,0.8)',
        border: '1px solid rgba(255,255,255,0.12)',
        background: '#111827',
        padding: '6px',
        borderRadius: '12px',
      }}
    >
      {filteredOptions.length > 0 ? (
        filteredOptions.map(opt => (
          <div
            key={opt.id}
            style={{
              padding: '10px 14px',
              cursor: 'pointer',
              borderRadius: '8px',
              background: String(value) === String(opt.id) ? 'rgba(16,185,129,0.15)' : 'transparent',
              marginBottom: '2px',
              display: 'flex',
              flexDirection: 'column',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = String(value) === String(opt.id) ? 'rgba(16,185,129,0.15)' : 'transparent'}
            onMouseDown={e => e.preventDefault()} // prevent blur before click
            onClick={() => {
              onChange(opt.id, opt);
              setIsOpen(false);
              setSearchTerm('');
            }}
          >
            <div style={{ fontWeight: '600', fontSize: '0.9rem', color: String(value) === String(opt.id) ? 'var(--primary)' : 'white' }}>
              {opt.name}
            </div>
            {(opt.city || opt.code) && (
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '3px' }}>
                {opt.code && <span>{opt.code} </span>}
                {opt.city && <span>• {opt.city}</span>}
              </div>
            )}
          </div>
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '18px', color: '#9ca3af', fontSize: '0.85rem' }}>
          No matches found
        </div>
      )}
    </div>,
    document.body
  ) : null;

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%', ...style }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'text',
          padding: '0 12px',
          height: '40px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '10px',
          border: isOpen ? '2px solid var(--primary)' : '1px solid var(--border)',
          transition: 'border 0.2s ease',
          boxShadow: isOpen ? '0 0 10px rgba(16,185,129,0.2)' : 'none'
        }}
        onClick={handleOpen}
      >
        <Search size={15} style={{ flexShrink: 0, marginRight: '8px', color: isOpen ? 'var(--primary)' : '#9ca3af' }} />

        <input
          ref={inputRef}
          type="text"
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'white',
            width: '100%',
            height: '100%',
            fontSize: '0.9rem'
          }}
          placeholder={selectedOption ? selectedOption.name : placeholder}
          value={isOpen ? searchTerm : (selectedOption ? selectedOption.name : '')}
          onChange={e => {
            setSearchTerm(e.target.value);
            if (!isOpen) { calcPos(); setIsOpen(true); }
          }}
          onFocus={handleOpen}
          onBlur={() => {
            // small delay to allow click on dropdown item to register
            setTimeout(() => setIsOpen(false), 150);
          }}
          autoComplete="off"
        />

        {value && !isOpen && (
          <div
            style={{ marginLeft: '6px', color: '#9ca3af', cursor: 'pointer' }}
            onMouseDown={e => e.preventDefault()}
            onClick={e => { e.stopPropagation(); onChange('', null); }}
          >
            <X size={14} />
          </div>
        )}

        {!value && !isOpen && (
          <ChevronDown size={15} style={{ marginLeft: '6px', opacity: 0.5, flexShrink: 0 }} />
        )}
      </div>

      {dropdown}
    </div>
  );
};

export default SearchableSelect;
