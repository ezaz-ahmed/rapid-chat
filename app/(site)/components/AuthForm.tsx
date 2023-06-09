'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { BsGithub, BsGoogle } from 'react-icons/bs';

import Button from '~/app/components/Button';
import Input from '~/app/components/inputs/Input';
import AuthSocialButton from './AuthSocialButton';
import { useRouter } from 'next/navigation';

type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/users');
    }
  }, [session?.status, router]);

  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER');
    } else {
      setVariant('LOGIN');
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = data => {
    setIsLoading(true);

    if (variant === 'LOGIN') {
      signIn('credentials', {
        ...data,
        redirect: false,
      })
        .then(callBack => {
          if (callBack?.error) {
            toast.error('Invalid Credentials');
          }

          if (callBack?.ok && !callBack.error) {
            router.push('/users');
          }
        })
        .finally(() => setIsLoading(false));
    }

    if (variant === 'REGISTER') {
      axios
        .post('api/register', data)
        .then(() => signIn('credentials', data))
        .catch(() => toast.error('Something went wrong'))
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);
    signIn(action, { redirect: false })
      .then(callBack => {
        if (callBack?.error) {
          toast.error('Invalid Credentials');
        }

        if (callBack?.ok && !callBack.error) {
          toast.success('ok');
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className=' mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
      <div className=' bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'>
        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
          {variant === 'REGISTER' && (
            <Input
              required
              label='Name'
              type='text'
              id='name'
              register={register}
              errors={errors}
            />
          )}

          <Input
            required
            label='Email'
            type='email'
            id='email'
            register={register}
            errors={errors}
          />

          <Input
            required
            label='Password'
            type='password'
            id='password'
            register={register}
            errors={errors}
          />

          <div>
            <Button
              type='submit'
              disabled={isLoading}
              fullWidth
              isLoading={isLoading}
            >
              {variant === 'LOGIN' ? 'Sign In' : 'Register'}
            </Button>
          </div>
        </form>

        <div className='mt-6'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300' />
            </div>

            <div className='relative flex justify-center text-sm'>
              <span className='bg-white px-2 text-gray-500'>
                Or continue with
              </span>
            </div>
          </div>

          <div className='mt-6 flex gap-2'>
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction('github')}
            />

            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction('google')}
            />
          </div>
        </div>

        <div className='flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500 '>
          <div>
            {variant === 'LOGIN'
              ? 'New to Messenger?'
              : 'Already have an account?'}
          </div>
          <div onClick={toggleVariant} className='underline cursor-pointer'>
            {variant === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
