import React, { useState } from 'react';
import { MapPin, X, Check, Search, Building } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CITIES } from '../data/mockData';

export const LocationModal = () => {
  const { isLocationModalOpen, setIsLocationModalOpen, currentCity, setCurrentCity, currentPincode, setCurrentPincode, addToast, cities } = useStore();
  const [searchCity, setSearchCity] = useState('');
  const [tempPincode, setTempPincode] = useState(currentPincode);

  if (!isLocationModalOpen) return null;

  const cityList = cities && cities.length > 0 ? cities : CITIES;
  const filteredCities = cityList.filter((c) => c.toLowerCase().includes(searchCity.toLowerCase()));

  const handleSelectCity = (cityName) => {
    setCurrentCity(cityName);
    if (tempPincode.length === 6) {
      setCurrentPincode(tempPincode);
    }
    setIsLocationModalOpen(false);
    addToast(`Delivery location updated to ${cityName}`, 'success');
  };

  return (
    <div className="modal-overlay" onClick={() => setIsLocationModalOpen(false)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--light-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-orange)' }}>
              <MapPin size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--primary-navy)' }}>Select Construction Site Location</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Delivery trucks & material hubs are routed by location</p>
            </div>
          </div>
          <button onClick={() => setIsLocationModalOpen(false)} style={{ background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem' }}>
          {/* Pincode Input */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Enter 6-Digit Site Pincode</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                maxLength={6}
                placeholder="e.g. 452005"
                className="form-control"
                value={tempPincode}
                onChange={(e) => setTempPincode(e.target.value.replace(/\D/g, ''))}
                style={{ flex: 1, letterSpacing: '2px', fontWeight: '700' }}
              />
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  if (tempPincode.length === 6) {
                    setCurrentPincode(tempPincode);
                    addToast(`Pincode ${tempPincode} applied!`, 'success');
                  }
                }}
              >
                Apply
              </button>
            </div>
          </div>

          {/* Quick Major Construction Hub Cities */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>Major Operational Cities</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Express Hubs</span>
            </div>

            {/* City search */}
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="text"
                placeholder="Search city (e.g. Indore, Bhopal, Mumbai)..."
                className="form-control"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                style={{ paddingLeft: '36px', fontSize: '0.875rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '8px' }}>
              {filteredCities.map((cityName) => {
                const isSelected = currentCity.toLowerCase() === cityName.toLowerCase();
                return (
                  <button
                    key={cityName}
                    type="button"
                    onClick={() => handleSelectCity(cityName)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'var(--navy-subtle)' : '#FFFFFF',
                      border: `1.5px solid ${isSelected ? 'var(--primary-navy)' : 'var(--border-subtle)'}`,
                      color: isSelected ? 'var(--primary-navy)' : 'var(--text-primary)',
                      fontWeight: isSelected ? '700' : '500',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                    }}
                  >
                    <span>{cityName}</span>
                    {isSelected && <Check size={14} color="var(--primary-navy)" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
