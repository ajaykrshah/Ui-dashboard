'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/shared/providers/auth.provider';
import { LoginCredentials } from '@/shared/types/auth.types';
import { Loader2, Shield, User } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

// Component that uses useSearchParams must be wrapped in Suspense
function SignInForm() {
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const [showLdapForm, setShowLdapForm] = useState(false);
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
    authMethod: 'development',
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';
  const errorParam = searchParams?.get('error');

  useEffect(() => {
    if (errorParam) {
      console.error('URL Error param:', errorParam);
    }
  }, [errorParam]);

  // Redirect authenticated users away from signin page
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      window.location.href = callbackUrl;
    }
  }, [isAuthenticated, isLoading, callbackUrl]);

  const handleSignIn = async (authMethod: 'ldap' | 'development') => {
    if (authMethod === 'ldap') {
      setShowLdapForm(true);
      setCredentials((prev) => ({ ...prev, authMethod: 'ldap' }));
      return;
    }

    if (authMethod === 'development') {
      setShowLdapForm(true); // Show form for dev credentials too
      setCredentials((prev) => ({ ...prev, authMethod: 'development' }));
      return;
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(credentials);
      // Redirect on successful login
      window.location.href = callbackUrl;
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md border-border shadow-lg'>
        <CardHeader className='space-y-1'>
          <div className='flex items-center justify-center mb-4'>
            <Shield className='h-8 w-8 text-primary' />
          </div>
          <CardTitle className='text-2xl text-center text-foreground'>Automation Portal</CardTitle>
          <CardDescription className='text-center text-muted-foreground'>
            Sign in to access the automation portal
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {error && (
            <Alert className='border-destructive/50 bg-destructive/10'>
              <AlertDescription className='text-destructive'>{error}</AlertDescription>
            </Alert>
          )}

          <div className='space-y-3'>
            {!showLdapForm ? (
              <>
                {/* Authentication Method Selection */}
                <Button
                  onClick={() => handleSignIn('ldap')}
                  disabled={isLoading}
                  className='w-full'
                  variant='default'
                >
                  <Shield className='mr-2 h-4 w-4' />
                  Sign in with Active Directory
                </Button>

                {/* Development Mode */}
                <div className='relative'>
                  <div className='absolute inset-0 flex items-center'>
                    <span className='w-full border-t' />
                  </div>
                  <div className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-background px-2 text-muted-foreground'>
                      Development Only
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => handleSignIn('development')}
                  disabled={isLoading}
                  variant='outline'
                  className='w-full'
                >
                  <User className='mr-2 h-4 w-4' />
                  Sign in with Dev Credentials
                </Button>
              </>
            ) : null}

            {/* Credential Forms */}
            {showLdapForm && (
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-medium'>
                    {credentials.authMethod === 'ldap'
                      ? 'Active Directory Sign In'
                      : 'Development Sign In'}
                  </h3>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      setShowLdapForm(false);
                      setCredentials({ username: '', password: '', authMethod: 'development' });
                    }}
                  >
                    ← Back
                  </Button>
                </div>

                <form onSubmit={handleFormSubmit} className='space-y-3'>
                  <div className='space-y-2'>
                    <Label htmlFor='username'>Username</Label>
                    <Input
                      id='username'
                      type='text'
                      placeholder={
                        credentials.authMethod === 'ldap'
                          ? 'username@domain.com'
                          : 'admin / user / demo'
                      }
                      value={credentials.username}
                      onChange={(e) =>
                        setCredentials((prev) => ({ ...prev, username: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='password'>Password</Label>
                    <Input
                      id='password'
                      type='password'
                      placeholder={
                        credentials.authMethod === 'ldap'
                          ? 'Enter your Active Directory password'
                          : 'admin123 / user123 / demo123'
                      }
                      value={credentials.password}
                      onChange={(e) =>
                        setCredentials((prev) => ({ ...prev, password: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <Button type='submit' disabled={isLoading} className='w-full'>
                    {isLoading ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : credentials.authMethod === 'ldap' ? (
                      <Shield className='mr-2 h-4 w-4' />
                    ) : (
                      <User className='mr-2 h-4 w-4' />
                    )}
                    {credentials.authMethod === 'ldap'
                      ? 'Sign In with Active Directory'
                      : 'Sign In with Dev Credentials'}
                  </Button>
                </form>

                <div className='text-xs text-center text-muted-foreground'>
                  {credentials.authMethod === 'ldap' ? (
                    <>
                      <strong>Supported formats:</strong>
                      <br />
                      username@domain.com or domain\username
                    </>
                  ) : (
                    <>
                      <strong>Default credentials:</strong>
                      <br />
                      admin/admin123 • user/user123 • demo/demo123
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className='text-xs text-center text-muted-foreground'>
            By signing in, you agree to our security policies and terms of use.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary'></div>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
