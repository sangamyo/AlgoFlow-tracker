
'use client';

import React from 'react';
import Link from 'next/link';
import { Workflow, LogOut, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { signOutUser } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation'; // For redirecting

interface AlgoFlowHeaderProps {
  currentUserEmail?: string | null;
  isLoadingAuth?: boolean;
}

export function AlgoFlowHeader({ currentUserEmail, isLoadingAuth }: AlgoFlowHeaderProps) {
  const { toast } = useToast();
  const router = useRouter();

  const handleSignOut = async () => {
    const error = await signOutUser();
    if (error) {
      toast({ variant: "destructive", title: "Sign Out Failed", description: error });
    } else {
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
      router.push('/login'); // Redirect to login page after sign out
    }
  };

  return (
    <header className="py-6 px-4 md:px-8 bg-card shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Workflow className="h-8 w-8 md:h-10 md:w-10 text-primary" />
          <h1 className="text-2xl md:text-4xl font-headline font-bold text-primary">
            AlgoFlow
          </h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          {isLoadingAuth ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : currentUserEmail ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">{currentUserEmail}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="mr-0 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">
                  <LogIn className="mr-0 sm:mr-2 h-4 w-4" /> 
                  <span className="hidden sm:inline">Login</span>
                </Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href="/signup">
                  <UserPlus className="mr-0 sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Sign Up</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
      <p className="container mx-auto mt-2 text-sm text-muted-foreground">
        Your personal guide to mastering Data Structures and Algorithms.
      </p>
    </header>
  );
}
