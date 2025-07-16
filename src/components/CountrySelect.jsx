import React from 'react';
import { COUNTRIES } from './countries';
import styles from './draft.module.css';

const CountrySelect = ({ value, onChange, exclude = [] }) => {
  const filtered = COUNTRIES.filter(
    c => !exclude.includes(c.name) || c.name === value?.name
  );
  return (
    <select
      className={styles.countrySelect}
      value={value?.name || ''}
      onChange={e => {
        const country = COUNTRIES.find(c => c.name === e.target.value);
        onChange && onChange(country);
      }}
    >
      <option value="">Страна</option>
      {filtered.map(country => (
        <option key={country.name} value={country.name}>
          {country.flag} {country.name}
        </option>
      ))}
    </select>
  );
};

export default CountrySelect;
