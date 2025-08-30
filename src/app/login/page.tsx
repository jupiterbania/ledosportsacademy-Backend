
"use client"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { signInWithGoogle, ADMIN_EMAIL, signOut } from "@/lib/auth";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { isConfigComplete } from "@/lib/firebase";
import { getMemberByEmail } from "@/lib/data";


export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  
  const handleLogin = async (role: 'admin' | 'member') => {
    if (!isConfigComplete) {
        toast({
            title: "Login Unavailable",
            description: "Firebase is not configured. Please check your environment variables.",
            variant: "destructive"
        });
        return;
    }

    try {
      const user = await signInWithGoogle();
      if (!user) {
        throw new Error("Google sign-in failed or was cancelled.");
      }
      
      if (role === 'admin') {
         const member = await getMemberByEmail(user.email!);
         if(user.email === ADMIN_EMAIL || member?.isAdmin) {
            toast({
              title: "Admin Login Successful",
              description: "Redirecting to the admin dashboard...",
            });
            router.push('/admin');
         } else {
            // Not a recognized admin, redirect to request page
            toast({
              title: "Admin Access Required",
              description: "Please request access to the admin dashboard.",
            });
            router.push('/admin-request');
         }
      } else {
        toast({
          title: "Login Successful",
          description: `Welcome, ${user.displayName}!`,
        });
        router.push('/');
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Could not authenticate with Google.",
        variant: "destructive"
      });
    }
  };


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] animate-fade-in">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl aurora-text-gradient">Choose Your Login</h1>
            <p className="mt-4 text-lg text-muted-foreground">Select your role to sign in and join the mission.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="aurora-card transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-1.5">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-gradient-to-br from-primary/20 to-primary/5 text-primary rounded-full p-4 w-20 h-20 flex items-center justify-center mb-4 ring-2 ring-primary/30 aurora-glow">
                    </div>
                    <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
                    <CardDescription>
                        For club administrators and staff.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full group" onClick={() => handleLogin('admin')} size="lg" variant="outline">
                        <svg className="mr-2 h-5 w-5 group-hover:text-primary transition-colors" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.3 64.5c-24.5-23.4-58.2-38.3-96.6-38.3-84.3 0-152.3 68.2-152.3 152.4s68 152.4 152.3 152.4c97.9 0 130.4-74.5 134.7-109.8H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>
                        Sign in as Admin
                    </Button>
                </CardContent>
            </Card>

            <Card className="aurora-card transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-1.5">
                <CardHeader className="text-center">
                     <div className="mx-auto bg-gradient-to-br from-primary/20 to-primary/5 text-primary rounded-full p-4 w-20 h-20 flex items-center justify-center mb-4 ring-2 ring-primary/30 aurora-glow">
                    </div>
                    <CardTitle className="text-2xl font-bold">Member Login</CardTitle>
                    <CardDescription>
                        For registered club members.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full group" onClick={() => handleLogin('member')} size="lg" variant="outline">
                       <svg className="mr-2 h-5 w-5 group-hover:text-primary transition-colors" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.3 64.5c-24.5-23.4-58.2-38.3-96.6-38.3-84.3 0-152.3 68.2-152.3 152.4s68 152.4 152.3 152.4c97.9 0 130.4-74.5 134.7-109.8H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>
                        Sign in as Member
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
