import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
//import axios from 'axios';  // for future API calls

import { useAuth } from '../context/AuthContext'; // to get user info if needed/JWT token
import { getProfile, updateProfile } from '../services/api';  // ✅ use API helpers
import Button from '../components/common/Button/Button';
import StatusIndicator from '../components/common/StatusIndicator/StatusIndicator';

// Zod schema for validation
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  sex: z.enum(['male', 'female', 'other'], { required_error: 'Please select sex' }),
  height: z.number({ invalid_type_error: 'Height must be a number' })
    .min(50, 'Height must be at least 50 cm'),
  weight: z.number({ invalid_type_error: 'Weight must be a number' })
    .min(1, 'Weight must be greater than 0'),
  age: z.number({ invalid_type_error: 'Age must be a number' })
    .min(1, 'Age must be at least 1')
    .max(120, 'Age must be less than 120'),
  goal: z.enum(['lose', 'gain', 'maintain'], { required_error: 'Please select a goal' }),
  activity_level: z.enum(['sedentary','light','moderate','very','extra'], { required_error: 'Please select activity' }),
});

export default function ProfileForm() {
  const navigate = useNavigate();
  const { getAccessToken, user } = useAuth();

  const { register, handleSubmit, formState, setFocus, setValue } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange', // validate live as user types
  });

  useEffect(() => {
    const firstError = Object.keys(formState.errors)[0];
    if (firstError) setFocus(firstError);

    // 👇 Fetch profile data to prefill form if it exists
    async function fetchProfile() {
      const token = getAccessToken();
      if (!token) return;
      try {
        const data = await getProfile(token);
        Object.keys(data).forEach((key) => {
          if (data[key] !== null && data[key] !== "") {
            setValue(key, data[key]);  // ✅ prefill form fields
          }
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    }
    fetchProfile();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.errors, setFocus, getAccessToken,setValue]);

  const onSubmit = async (values) => {
  try {
    const token = getAccessToken();
    console.log('Submitting profile:', values);
    console.log('Access token:', token);
    
    await updateProfile(values, token);
    toast.success('Profile saved to database!');
    navigate('/dashboard', { replace: true });
  } catch (err) {
    console.error('Full error:', err); // See full error
    console.error('Error response:', err.response?.data); // See backend response
    console.error('Error status:', err.response?.status); // See status code
    
    const errorMsg = err.response?.data?.detail || 'Failed to save profile. Try again.';
    toast.error(errorMsg);
  }
};

  /*
      // Save to localStorage for now (replace with API call later)
      localStorage.setItem('userProfile', JSON.stringify(values));
      toast.success('Profile saved!');
      navigate('/dashboard', { replace: true });
    } catch {
      toast.error('Something went wrong. Try again.');
    }
  };
  */

  const skip = () => {
    toast('Skipped profile setup.');
    navigate('/dashboard', { replace: true });
  };

  const isLoading = formState.isSubmitting;
  const isValid = formState.isValid; // track if form passes validation

  return (
    <div className="auth-card">
      <h2>Set up your Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Name */}
        <label>Name</label>
        <input type="text" {...register('name')} />
        {formState.errors.name && <p className="error">{formState.errors.name.message}</p>}

        {/* Sex */}
        <label>Sex</label>
        <select {...register('sex')}>
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {formState.errors.sex && <p className="error">{formState.errors.sex.message}</p>}

        {/* Height */}
        <label>Height (cm)</label>
        <input type="number" {...register('height', { valueAsNumber: true })} />
        {formState.errors.height && <p className="error">{formState.errors.height.message}</p>}

        {/* Weight */}
        <label>Weight (kg)</label>
        <input type="number" {...register('weight', { valueAsNumber: true })} />
        {formState.errors.weight && <p className="error">{formState.errors.weight.message}</p>}

        {/* Age */}
        <label>Age</label>
        <input type="number" {...register('age', { valueAsNumber: true })} />
        {formState.errors.age && <p className="error">{formState.errors.age.message}</p>}
        {/* Activity Level */}
        <label>Activity Level</label>
        <select {...register('activity_level')}>
        <option value="">Select</option>
        <option value="sedentary">Sedentary</option>
        <option value="light">Lightly Active</option>
        <option value="moderate">Moderately Active</option>
        <option value="very">Very Active</option>
        <option value="extra">Extra Active</option>
        </select>
        {formState.errors.activity_level && <p className="error">{formState.errors.activity_level.message}</p>}
        

        {/* Goal */}
        <label>Goal</label>
        <select {...register('goal')}>
          <option value="">Select</option>
          <option value="lose">Lose Weight</option>
          <option value="gain">Gain Muscle</option>
          <option value="maintain">Maintain</option>
        </select>
        {formState.errors.goal && <p className="error">{formState.errors.goal.message}</p>}

        {/* Buttons */}
        <div style={{ marginTop: 20, display: 'flex', gap: '10px' }}>
          <Button
            loading={isLoading}
            disabled={!isValid || isLoading}  // disable if form invalid or submitting
            type="submit"
          >
            Save
          </Button>
          <Button type="button" onClick={skip}>
            Skip
          </Button>
        </div>
      </form>

      <StatusIndicator
        status="info"
        message="You can update your profile later in settings."
      />
    </div>
  );
}
