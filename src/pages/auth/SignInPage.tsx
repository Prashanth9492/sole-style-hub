import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  
  const { signIn, signInWithGoogle, signInWithApple } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
      navigate('/');
    } catch (error: any) {
      let message = 'Failed to sign in';
      if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later';
      }
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast({
        title: 'Welcome!',
        description: 'You have successfully signed in with Google.',
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign in with Google',
        variant: 'destructive',
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setAppleLoading(true);
    try {
      await signInWithApple();
      toast({
        title: 'Welcome!',
        description: 'You have successfully signed in with Apple.',
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign in with Apple',
        variant: 'destructive',
      });
    } finally {
      setAppleLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Shoe Silhouettes - Top Left */}
          <div className="absolute -top-20 -left-20 w-64 h-64 opacity-5">
            <svg viewBox="0 0 200 200" className="w-full h-full text-black dark:text-white">
              <path fill="currentColor" d="M180 120c0 5-2 8-6 10-8 4-20 6-35 8-15 2-35 3-55 3s-40-1-55-3c-15-2-27-4-35-8-4-2-6-5-6-10 0-8 5-15 12-20 7-6 17-10 28-13 11-3 24-5 38-6 14-1 28-1 38 0 10 1 20 2 28 5 8 2 15 5 21 9 6 4 10 9 12 15 2 4 3 7 3 10zm-15-35c-10-8-25-13-42-15-17-2-35-2-52 0-17 2-32 7-42 15-5 4-8 9-9 14 0 2 0 3 1 5 2 4 6 7 12 10 11 5 26 8 43 10 17 2 35 2 52 0 17-2 32-5 43-10 6-3 10-6 12-10 1-2 1-3 1-5-1-5-4-10-9-14z"/>
            </svg>
          </div>
          
          {/* Shoe Silhouettes - Top Right */}
          <div className="absolute -top-10 right-10 w-48 h-48 opacity-5 rotate-45">
            <svg viewBox="0 0 200 200" className="w-full h-full text-black dark:text-white">
              <path fill="currentColor" d="M160 100c5 15 8 30 8 45 0 8-2 14-6 18-4 4-10 6-18 6H56c-8 0-14-2-18-6-4-4-6-10-6-18 0-15 3-30 8-45l5-15c3-8 7-15 13-20 6-5 13-8 22-8h40c9 0 16 3 22 8 6 5 10 12 13 20l5 15zm-15 5l-4-12c-2-6-5-11-9-14-4-3-9-5-15-5h-34c-6 0-11 2-15 5-4 3-7 8-9 14l-4 12c-4 13-6 26-6 38 0 5 1 8 3 10 2 2 5 3 10 3h76c5 0 8-1 10-3 2-2 3-5 3-10 0-12-2-25-6-38z"/>
            </svg>
          </div>

          {/* Shoe Silhouettes - Bottom Left */}
          <div className="absolute -bottom-10 left-20 w-56 h-56 opacity-5 -rotate-12">
            <svg viewBox="0 0 200 200" className="w-full h-full text-black dark:text-white">
              <path fill="currentColor" d="M170 130c0 6-3 11-8 14-5 3-12 5-20 7-16 3-36 4-58 4s-42-1-58-4c-8-2-15-4-20-7-5-3-8-8-8-14 0-10 6-19 16-26 10-7 24-12 40-15 16-3 34-4 52-4s36 1 52 4c16 3 30 8 40 15 10 7 16 16 16 26zm-20 0c0-6-4-11-10-15-7-4-16-7-27-9-11-2-24-3-38-3s-27 1-38 3c-11 2-20 5-27 9-6 4-10 9-10 15s4 11 10 15c7 4 16 7 27 9 11 2 24 3 38 3s27-1 38-3c11-2 20-5 27-9 6-4 10-9 10-15z"/>
            </svg>
          </div>

          {/* Shoe Silhouettes - Bottom Right */}
          <div className="absolute -bottom-16 -right-16 w-72 h-72 opacity-5 rotate-90">
            <svg viewBox="0 0 200 200" className="w-full h-full text-black dark:text-white">
              <path fill="currentColor" d="M175 115c0 7-3 13-9 17-6 4-14 7-24 9-20 4-44 5-67 5s-47-1-67-5c-10-2-18-5-24-9-6-4-9-10-9-17 0-12 7-22 19-30 12-8 28-14 46-18 18-4 39-6 60-6s42 2 60 6c18 4 34 10 46 18 12 8 19 18 19 30zm-25 0c0-8-5-14-13-19-8-5-19-9-33-11-14-3-30-4-47-4s-33 1-47 4c-14 2-25 6-33 11-8 5-13 11-13 19s5 14 13 19c8 5 19 9 33 11 14 3 30 4 47 4s33-1 47-4c14-2 25-6 33-11 8-5 13-11 13-19z"/>
            </svg>
          </div>

          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:100px_100px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />

          {/* Floating Decorative Elements */}
          <div className="absolute top-1/4 left-10 w-4 h-4 bg-amber-500/20 rounded-full animate-pulse" />
          <div className="absolute top-1/3 right-20 w-3 h-3 bg-blue-500/20 rounded-full animate-pulse delay-75" />
          <div className="absolute bottom-1/4 left-1/4 w-5 h-5 bg-purple-500/20 rounded-full animate-pulse delay-150" />
          <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-amber-600/20 rounded-full animate-pulse delay-300" />
        </div>

        <Card className="w-full max-w-md shadow-xl relative z-10 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
          <CardHeader className="space-y-1 text-center">
            <Link to="/" className="inline-block mb-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sole Style
              </h1>
            </Link>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Social Sign In Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading || appleLoading}
              className="w-full"
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleAppleSignIn}
              disabled={appleLoading || loading || googleLoading}
              className="w-full"
            >
              {appleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  Apple
                </>
              )}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
    </>
  );
};

export default SignInPage;
