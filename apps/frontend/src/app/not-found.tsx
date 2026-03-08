
'use client';

import { ArrowRight } from 'lucide-react';
import { Container } from '../components';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter()
  return (
    <Container className="mt-16 min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md space-y-6">
        <h1
          className="text-[220px] font-bold leading-none tracking-tighter animate-fade-in-down"
          style={{ animationDelay: '0.2s', animationDuration: '0.8s' }}
        >
          404
        </h1>
        <h2
          className="text-4xl font-bold animate-fade-in-up"
          style={{ animationDelay: '0.4s', animationDuration: '0.8s' }}
        >
          Opps ! This page doesn't exist.
        </h2>
        <p
          className="text-muted-foreground animate-fade-in-up"
          style={{ animationDelay: '0.6s', animationDuration: '0.8s' }}
        >
          The page you are looking for might not exist or has been moved.
          <br />
          Please check the link or navigate using the menu above.
        </p>

        <div
          className="flex flex-col items-center justify-center animate-fade-in-up"
          style={{ animationDelay: '0.8s', animationDuration: '0.8s' }}
        >
          <button
            onClick={() => router.back}
            className="inline-flex items-center justify-center gap-2 bg-main px-6 py-3 font-medium text-black transition-colors hover:bg-main/80 hover:scale-105 transform md:transition-transform duration-300 animate-pulse-subtle"
          >
            Return
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </Container>
  );
}
