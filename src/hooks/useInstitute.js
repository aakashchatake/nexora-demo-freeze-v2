import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * useInstitute Hook
 * 
 * Manages institute context across the application.
 * Resolution order:
 * 1. URL query parameter (?institute=XX)
 * 2. localStorage nexora_institute_id
 * 3. If missing -> consumer should redirect to /#/access
 * 
 * Returns:
 * - instituteId: string | null
 * - instituteName: string | null
 * - institutionType: string | null
 * - status: string | null
 * - loading: boolean
 * - error: string | null
 * - setInstitute: (id, profile) => void - For manually setting institute
 * - clearInstitute: () => void - For logout/reset
 */
export function useInstitute() {
  const [instituteId, setInstituteId] = useState(null);
  const [instituteName, setInstituteName] = useState(null);
  const [institutionType, setInstitutionType] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInstitute();
  }, []);

  const loadInstitute = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Check URL query param
      const params = new URLSearchParams(window.location.hash.split('?')[1]);
      const queryInstituteId = params.get('institute');

      // 2. Check localStorage
      const storedInstituteId = localStorage.getItem('nexora_institute_id');
      const storedProfile = localStorage.getItem('nexora_institute_profile');

      // Determine which institute ID to use
      const targetInstituteId = queryInstituteId || storedInstituteId;

      if (!targetInstituteId) {
        // No institute context available
        setLoading(false);
        return;
      }

      // If we have stored profile and it matches target ID, use it
      if (storedProfile && storedInstituteId === targetInstituteId) {
        try {
          const profile = JSON.parse(storedProfile);
          setInstituteId(profile.institute_id);
          setInstituteName(profile.institute_name);
          setInstitutionType(profile.institution_type);
          setStatus(profile.status);
          setLoading(false);
          return;
        } catch (e) {
          // Invalid JSON, fetch fresh
          console.warn('Invalid stored institute profile, fetching fresh');
        }
      }

      // Fetch fresh institute data from Supabase
      const { data, error: fetchError } = await supabase
        .from('institutes')
        .select('institute_id, institute_name, institution_type, status')
        .eq('institute_id', targetInstituteId)
        .single();

      if (fetchError) {
        throw new Error(fetchError.message || 'Failed to fetch institute data');
      }

      if (!data) {
        throw new Error('Institute not found');
      }

      // Update state
      setInstituteId(data.institute_id);
      setInstituteName(data.institute_name);
      setInstitutionType(data.institution_type);
      setStatus(data.status);

      // Update localStorage
      localStorage.setItem('nexora_institute_id', data.institute_id);
      localStorage.setItem('nexora_institute_profile', JSON.stringify(data));

    } catch (err) {
      console.error('useInstitute error:', err);
      setError(err.message || 'Failed to load institute context');
    } finally {
      setLoading(false);
    }
  };

  const setInstitute = (id, profile) => {
    setInstituteId(id);
    setInstituteName(profile.institute_name);
    setInstitutionType(profile.institution_type);
    setStatus(profile.status);
    localStorage.setItem('nexora_institute_id', id);
    localStorage.setItem('nexora_institute_profile', JSON.stringify(profile));
  };

  const clearInstitute = () => {
    setInstituteId(null);
    setInstituteName(null);
    setInstitutionType(null);
    setStatus(null);
    localStorage.removeItem('nexora_institute_id');
    localStorage.removeItem('nexora_institute_profile');
  };

  return {
    instituteId,
    instituteName,
    institutionType,
    status,
    loading,
    error,
    setInstitute,
    clearInstitute,
    reload: loadInstitute,
  };
}
