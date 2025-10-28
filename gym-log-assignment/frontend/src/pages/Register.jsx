import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Use your existing components
import Button from '../components/common/Button/Button';
import StatusIndicator from '../components/common/StatusIndicator/StatusIndicator';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Register() {
  const { setSession } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState, setFocus, resetField } = useForm({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
  });

  useEffect(() => {
    const firstError = Object.keys(formState.errors)[0];
    if (firstError) setFocus(firstError);
  }, [formState.errors, setFocus]);

  const onSubmit = async (values) => {
    try {
      const data = await registerUser(values);
      setSession({ access: data?.access, user: data?.user });
      toast.success('Account created!');
      navigate('/profile', { replace: true });
    } catch (err) {
      console.error('Registration error:', err.response?.data); // Debug log
    
    // Handle error message from backend
    let msg = 'Registration failed. Please try again.';
    
    if (err?.response?.data?.detail) {
      const detail = err.response.data.detail;
      // Backend can return array or string
      msg = Array.isArray(detail) ? detail[0] : detail;
    } else if (err?.response?.data?.email) {
      // Handle validation errors on specific fields
      const emailError = err.response.data.email;
      msg = Array.isArray(emailError) ? emailError[0] : emailError;
    }
      
      toast.error(msg);
      resetField('password'); // preserve email, clear password
      setFocus('email');
    }
  };

  const isLoading = formState.isSubmitting;

  return (
    <div className="auth-card">
      <h2>Create account</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label>Email</label>
        <input type="email" placeholder="you@example.com" {...register('email')} />
        {formState.errors.email && <p className="error">{formState.errors.email.message}</p>}

        <label>Password</label>
        <input type="password" placeholder="••••••••" {...register('password')} />
        {formState.errors.password && <p className="error">{formState.errors.password.message}</p>}

        <Button loading={isLoading} disabled={isLoading}>Register</Button>
      </form>

      <p style={{marginTop: 12}}>Already have an account? <a href="/login">Log in</a></p>
      <StatusIndicator status="info" message="Use a valid email and 6+ char password." />
    </div>
  );
}
