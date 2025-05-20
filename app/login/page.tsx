import LoginForm from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8">
        <h1 className="mb-8 text-center text-3xl font-bold">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}