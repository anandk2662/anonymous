"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link 
          href="/" 
          className="text-2xl font-bold tracking-tight transition-colors hover:text-primary"
        >
          Anonymous
        </Link>
        
        {session ? (
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground sm:inline-block">
              Welcome, <span className="font-semibold text-foreground">{user?.username || user?.email}</span>
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => signOut()}
              className="font-medium"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button variant="default" size="sm" asChild>
            <Link href="/signin">Login</Link>
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
