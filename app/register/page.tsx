import RegisterForm from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8">
        <h1 className="mb-8 text-center text-3xl font-bold">Create an Account</h1>
        <RegisterForm />
      </div>
    </div>
  );
}