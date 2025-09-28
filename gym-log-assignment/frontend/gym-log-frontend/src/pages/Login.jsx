import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

import Button from '../components/common/Button/Button';
import StatusIndicator from '../components/common/StatusIndicator/StatusIndicator';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

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
      const data = await loginUser(values);
      setSession({ access: data?.access, user: data?.user });
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch {
      toast.error('Invalid email or password.');
      resetField('password');
      setFocus('email');
    }
  };

  const isLoading = formState.isSubmitting;

  return (
    <div className="auth-card">
      <h2>Log in</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label>Email</label>
        <input type="email" placeholder="you@example.com" {...register('email')} />
        {formState.errors.email && <p className="error">{formState.errors.email.message}</p>}

        <label>Password</label>
        <input type="password" placeholder="••••••••" {...register('password')} />
        {formState.errors.password && <p className="error">{formState.errors.password.message}</p>}

        <Button loading={isLoading} disabled={isLoading}>Log in</Button>
      </form>

      <p style={{marginTop: 12}}>New here? <a href="/register">Create an account</a></p>
      <StatusIndicator status="info" message="We’ll keep you signed in with your access token." />
    </div>
  );
}
