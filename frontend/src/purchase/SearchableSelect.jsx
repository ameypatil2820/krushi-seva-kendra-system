import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, ChevronDown, X } from 'lucide-react';

const SearchableSelect = ({ options, value, onChange, placeholder, style, height = '40px', padding = '0 12px', textColor = 'white', bgColor = '#111827', inputRef: forwardedRef, onEnterSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Sync the internal ref with the forwarded ref
  useEffect(() => {
    if (forwardedRef) {
      if (typeof forwardedRef === 'function') {
        forwardedRef(inputRef.current);
      } else {
        forwardedRef.current = inputRef.current;
      }
    }
  }, [forwardedRef]);

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

  const selectOption = (opt) => {
    onChange(opt.id, opt);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(0);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(i => Math.min(i + 1, filteredOptions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (filteredOptions[highlightedIndex]) {
        selectOption(filteredOptions[highlightedIndex]);
        // After selection, call the parent's enter handler (e.g. add new row)
        if (onEnterSelect) setTimeout(() => onEnterSelect(), 30);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

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
        background: bgColor,
        padding: '6px',
        borderRadius: '12px',
      }}
    >
      {filteredOptions.length > 0 ? (
        filteredOptions.map((opt, idx) => (
          <div
            key={opt.id}
            style={{
              padding: '10px 14px',
              cursor: 'pointer',
              borderRadius: '8px',
              background: idx === highlightedIndex ? 'rgba(16,185,129,0.2)' : (String(value) === String(opt.id) ? 'rgba(16,185,129,0.15)' : 'transparent'),
              marginBottom: '2px',
              display: 'flex',
              flexDirection: 'column',
            }}
            onMouseEnter={() => setHighlightedIndex(idx)}
            onMouseLeave={() => {}}
            onMouseDown={e => e.preventDefault()}
            onClick={() => selectOption(opt)}
          >
            <div style={{ fontWeight: '600', fontSize: '0.9rem', color: String(value) === String(opt.id) ? 'var(--primary)' : textColor }}>
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
          padding: padding,
          height: height,
          background: textColor === 'white' ? 'rgba(255,255,255,0.05)' : 'white',
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
            color: textColor,
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
            setTimeout(() => setIsOpen(false), 150);
          }}
          onKeyDown={handleKeyDown}
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
