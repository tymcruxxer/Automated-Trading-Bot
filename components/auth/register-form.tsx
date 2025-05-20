"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // const { toast } = useToast();
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });
  
  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        // toast({
        //   title: 'Error',
        //   description: result.error || 'Something went wrong',
        //   variant: 'destructive',
        // });
        console.error('Registration error:', result.error);
        return;
      }
      
      // toast({
      //   title: 'Success',
      //   description: 'Account created successfully',
      // });
      console.log('Registration successful:', result);
      
      // Sign in the user
      await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      
      router.push('/setup');
      router.refresh();
    } catch (error) {
      // toast({
      //   title: 'Error',
      //   description: 'Something went wrong',
      //   variant: 'destructive',
      // });
      console.error('Registration error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your details to create a new account</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              disabled={isLoading}
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              disabled={isLoading}
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              disabled={isLoading}
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign Up
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="underline underline-offset-4 hover:text-primary">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}