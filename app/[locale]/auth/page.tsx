'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useTranslation } from '@/components/TranslationProvider';
import LoginButton from '@/components/LoginButton';

export default function LoginPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const { translate } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Formulář pouze sbírá data, samotné přihlášení je v LoginButton komponentě
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {translate('auth.signin_title', locale, { defaultValue: 'Sign in to your account' })}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {translate('auth.or', locale, { defaultValue: 'Or' })}{' '}
          <Link href={`/${locale}/auth/register`} className="font-medium text-primary-600 hover:text-primary-500">
            {translate('auth.create_account', locale, { defaultValue: 'create a new account' })}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{translate('auth.error', locale, { defaultValue: 'Error' })}</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit} role="form">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {translate('auth.email', locale, { defaultValue: 'Email address' })}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {translate('auth.password', locale, { defaultValue: 'Password' })}
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  {translate('auth.remember_me', locale, { defaultValue: 'Remember me' })}
                </label>
              </div>

              <div className="text-sm">
                <Link href={`/${locale}/auth/forgot-password`} className="font-medium text-primary-600 hover:text-primary-500">
                  {translate('auth.forgot_password', locale, { defaultValue: 'Forgot your password?' })}
                </Link>
              </div>
            </div>

            <div>
              <LoginButton
                email={email}
                password={password}
                isLoading={loading}
                setIsLoading={setLoading}
                setError={setError}
              />
            </div>
          </form>


        </div>
      </div>
    </div>
  );
}