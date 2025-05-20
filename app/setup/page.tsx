import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import SetupForm from '@/components/setup/setup-form';

export default async function SetupPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }
  
  const config = await prisma.botConfig.findFirst({
    where: { userId: session.user.id },
    select: {
      apiKey: true,
      apiSecret: true,
      currencyPair: true,
    },
  });
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Bot Setup</h1>
      <SetupForm initialData={config || undefined} />
    </div>
  );
}