import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import './AccessGateway.css';

export default function AccessGateway() {
  const navigate = useNavigate();
  const [instituteId, setInstituteId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedInstitute, setVerifiedInstitute] = useState(null);
  const [error, setError] = useState('');

  // Check for pre-filled institute from query param
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const prefilledId = params.get('institute');
    if (prefilledId) {
      setInstituteId(prefilledId);
    }
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');
    setVerifiedInstitute(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('institutes')
        .select('institute_id, institute_name, institution_type, status')
        .eq('institute_id', instituteId.toUpperCase())
        .single();

      if (fetchError || !data) {
        throw new Error('Institute ID not recognised. Please verify your ID or contact support.');
      }

      if (data.status !== 'active') {
        throw new Error('Institute account is not active. Please contact Nexora Support.');
      }

      // Success - show verified state
      setVerifiedInstitute(data);

      // Store in localStorage
      localStorage.setItem('nexora_institute_id', data.institute_id);
      localStorage.setItem('nexora_institute_profile', JSON.stringify(data));

    } catch (err) {
      console.error('Verification error:', err);
      setError(err.message || 'Failed to verify institute ID');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleContinue = () => {
    if (verifiedInstitute) {
      navigate(`/platform?institute=${verifiedInstitute.institute_id}`);
    }
  };

  return (
    <div className="access-gateway">
      <div className="access-gateway-container">
        {/* Header */}
        <div className="access-gateway-header">
          <h1 className="access-gateway-brand">NEXORA</h1>
          <h2 className="access-gateway-title">Institutional Access Gateway</h2>
          <p className="access-gateway-subtitle">Verify your institute to continue</p>
        </div>

        {/* Content Card */}
        <div className="access-gateway-card">
          {!verifiedInstitute ? (
            // Verification Form
            <form onSubmit={handleVerify} className="access-gateway-form">
              <div className="access-gateway-input-group">
                <label htmlFor="instituteId" className="access-gateway-label">
                  Institute ID
                </label>
                <input
                  type="text"
                  id="instituteId"
                  className="access-gateway-input"
                  placeholder="SIT-2026"
                  value={instituteId}
                  onChange={(e) => setInstituteId(e.target.value.toUpperCase())}
                  required
                  autoFocus
                />
              </div>

              {error && (
                <div className="access-gateway-error">
                  <div className="access-gateway-error-icon">⚠️</div>
                  <div className="access-gateway-error-content">
                    <p className="access-gateway-error-text">{error}</p>
                    <a
                      href={`mailto:nexora@chatakeinnoworks.com?subject=Institute Access Help&body=Institute ID: ${instituteId}%0D%0A%0D%0AI need help accessing Nexora.`}
                      className="access-gateway-error-link"
                    >
                      Contact Nexora Support →
                    </a>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="access-gateway-button primary"
                disabled={isVerifying || !instituteId.trim()}
              >
                {isVerifying ? (
                  <>
                    <span className="access-gateway-spinner"></span>
                    Verifying...
                  </>
                ) : (
                  'Verify Institute'
                )}
              </button>
            </form>
          ) : (
            // Verified State
            <div className="access-gateway-verified">
              <div className="access-gateway-verified-icon">✓</div>
              <h3 className="access-gateway-verified-title">Verified Institution</h3>
              <div className="access-gateway-verified-info">
                <p className="access-gateway-verified-name">{verifiedInstitute.institute_name}</p>
                <p className="access-gateway-verified-id">Institute ID: {verifiedInstitute.institute_id}</p>
                <p className="access-gateway-verified-type">{verifiedInstitute.institution_type}</p>
              </div>
              <button
                onClick={handleContinue}
                className="access-gateway-button primary large"
              >
                Continue to Portal →
              </button>
              <button
                onClick={() => {
                  setVerifiedInstitute(null);
                  setInstituteId('');
                  setError('');
                }}
                className="access-gateway-button secondary"
              >
                Verify Different Institute
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="access-gateway-footer">
          <p className="access-gateway-footer-powered">Powered by Nexora</p>
          <p className="access-gateway-footer-copyright">© 2026 Chatake Innoworks Pvt. Ltd.</p>
          <p className="access-gateway-footer-encrypted">🔒 Encrypted institutional access</p>
        </div>
      </div>
    </div>
  );
}
