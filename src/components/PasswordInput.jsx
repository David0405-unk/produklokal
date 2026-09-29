import { useState } from 'react';

function PasswordInput({ value, onChange, placeholder = 'Kata Sandi', ...rest }) {
  const [tampil, setTampil] = useState(false);

  return (
    <div className="password-field">
      <input
        type={tampil ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setTampil(!tampil)}
        aria-label={tampil ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
        aria-pressed={tampil}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {tampil ? (
            <>
              <path d="M17.94 17.94A10.9 10.9 0 0 1 12 19c-7 0-11-7-11-7a19.8 19.8 0 0 1 5.06-5.94M9.9 4.24A10.9 10.9 0 0 1 12 5c7 0 11 7 11 7a19.7 19.7 0 0 1-3.17 4.19" />
              <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
              <path d="M1 1l22 22" />
            </>
          ) : (
            <>
              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
              <circle cx="12" cy="12" r="3" />
            </>
          )}
        </svg>
      </button>
    </div>
  );
}

export default PasswordInput;