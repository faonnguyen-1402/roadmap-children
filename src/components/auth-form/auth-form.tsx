'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, LogOut } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  totalScore: number;
  level: number;
  streak: number;
  badges: string[];
  completedTopics: string[];
}

interface AuthFormProps {
  onLogin: (user: User) => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  age?: string;
  general?: string;
}

export function AuthForm({ onLogin }: AuthFormProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email là bắt buộc';
    if (!emailRegex.test(email)) return 'Email không hợp lệ';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Mật khẩu là bắt buộc';
    if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
    return undefined;
  };

  const validateName = (name: string): string | undefined => {
    if (!name) return 'Tên là bắt buộc';
    if (name.length < 2) return 'Tên phải có ít nhất 2 ký tự';
    if (name.length > 50) return 'Tên không được quá 50 ký tự';
    return undefined;
  };

  const validateAge = (age: string): string | undefined => {
    const ageNum = Number.parseInt(age);
    if (!age) return 'Tuổi là bắt buộc';
    if (isNaN(ageNum)) return 'Tuổi phải là số';
    if (ageNum < 6 || ageNum > 12) return 'Tuổi phải từ 6 đến 12';
    return undefined;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validate inputs
    const newErrors: FormErrors = {};
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // Check if user exists in localStorage
      const existingUsers = JSON.parse(
        localStorage.getItem('registeredUsers') || '[]'
      );
      const user = existingUsers.find((u: any) => u.email === email);

      if (user && user.password === password) {
        const { password: _, ...userWithoutPassword } = user;
        onLogin(userWithoutPassword);
      } else {
        setErrors({ general: 'Email hoặc mật khẩu không đúng' });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const age = formData.get('age') as string;

    // Validate inputs
    const newErrors: FormErrors = {};
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const ageError = validateAge(age);

    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    if (ageError) newErrors.age = ageError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // Check if email already exists
      const existingUsers = JSON.parse(
        localStorage.getItem('registeredUsers') || '[]'
      );
      const emailExists = existingUsers.some((u: any) => u.email === email);

      if (emailExists) {
        setErrors({ general: 'Email này đã được đăng ký' });
        setIsLoading(false);
        return;
      }

      // Create new user
      const newUser: User & { password: string } = {
        id: Date.now().toString(),
        name,
        email,
        age: Number.parseInt(age),
        password,
        totalScore: 0,
        level: 1,
        streak: 0,
        badges: ['beginner'],
        completedTopics: [],
      };

      // Save to localStorage
      existingUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

      // Login user
      const { password: _, ...userWithoutPassword } = newUser;
      onLogin(userWithoutPassword);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md shadow-2xl'>
        <CardHeader className='text-center'>
          <CardTitle className='text-3xl font-bold text-primary'>
            🌟 Khám Phá Bản Thân 🌟
          </CardTitle>
          <CardDescription className='text-lg'>
            Game phát triển kỹ năng sống cho bé
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={isLoginMode ? 'login' : 'register'}
            onValueChange={(value) => {
              setIsLoginMode(value === 'login');
              setErrors({});
            }}
          >
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='login'>Đăng nhập</TabsTrigger>
              <TabsTrigger value='register'>Đăng ký</TabsTrigger>
            </TabsList>

            {errors.general && (
              <Alert className='mt-4 border-red-200 bg-red-50'>
                <AlertDescription className='text-red-600'>
                  {errors.general}
                </AlertDescription>
              </Alert>
            )}

            <TabsContent value='login' className='space-y-4 mt-6'>
              <form onSubmit={handleLogin} className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='login-email'>Email</Label>
                  <Input
                    id='login-email'
                    name='email'
                    type='email'
                    placeholder='Nhập email của bạn'
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className='text-sm text-red-500'>{errors.email}</p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='login-password'>Mật khẩu</Label>
                  <div className='relative'>
                    <Input
                      id='login-password'
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Nhập mật khẩu'
                      className={
                        errors.password ? 'border-red-500 pr-10' : 'pr-10'
                      }
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className='text-sm text-red-500'>{errors.password}</p>
                  )}
                </div>

                <Button type='submit' className='w-full' disabled={isLoading}>
                  {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value='register' className='space-y-4 mt-6'>
              <form onSubmit={handleRegister} className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='register-name'>Tên</Label>
                  <Input
                    id='register-name'
                    name='name'
                    placeholder='Nhập tên của bạn'
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className='text-sm text-red-500'>{errors.name}</p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='register-email'>Email</Label>
                  <Input
                    id='register-email'
                    name='email'
                    type='email'
                    placeholder='Nhập email của bạn'
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className='text-sm text-red-500'>{errors.email}</p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='register-age'>Tuổi</Label>
                  <Input
                    id='register-age'
                    name='age'
                    type='number'
                    min='6'
                    max='12'
                    placeholder='Nhập tuổi của bạn'
                    className={errors.age ? 'border-red-500' : ''}
                  />
                  {errors.age && (
                    <p className='text-sm text-red-500'>{errors.age}</p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='register-password'>Mật khẩu</Label>
                  <div className='relative'>
                    <Input
                      id='register-password'
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Nhập mật khẩu (ít nhất 6 ký tự)'
                      className={
                        errors.password ? 'border-red-500 pr-10' : 'pr-10'
                      }
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className='text-sm text-red-500'>{errors.password}</p>
                  )}
                </div>

                <Button type='submit' className='w-full' disabled={isLoading}>
                  {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export function LogoutButton({ onLogout }: { onLogout: () => void }) {
  return (
    <Button
      variant='outline'
      size='sm'
      onClick={onLogout}
      className='flex items-center gap-2 bg-transparent'
    >
      <LogOut className='w-4 h-4' />
      Đăng xuất
    </Button>
  );
}
