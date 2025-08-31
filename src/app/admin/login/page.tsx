
"use client"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { signInWithGoogle, ADMIN_EMAIL } from "@/lib/auth";
import { useAuth } from "@/hooks/use-auth";
import { isConfigComplete } from "@/lib/firebase";
import { getMemberByEmail } from "@/lib/data";
import { useEffect } from "react";

export default function AdminLoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && user && isAdmin) {
      router.push('/admin');
    }
  }, [user, isAdmin, loading, router]);


  const handleLogin = async () => {
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
      
      const member = await getMemberByEmail(user.email!);
      if(user.email === ADMIN_EMAIL || member?.isAdmin) {
         toast({
           title: "Admin Login Successful",
           description: "Redirecting to the admin dashboard...",
         });
         router.push('/admin');
      } else {
         toast({
           title: "Access Denied",
           description: "You do not have permission to access the admin panel.",
           variant: "destructive"
         });
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
    <div className="flex items-center justify-center min-h-screen animate-fade-in">
      <Card className="w-full max-w-md mx-4 aurora-card">
          <CardHeader className="text-center">
              <div className="mx-auto bg-gradient-to-br from-primary/20 to-primary/5 text-primary rounded-full p-4 w-20 h-20 flex items-center justify-center mb-4 ring-2 ring-primary/30 aurora-glow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <CardTitle className="text-2xl font-bold">AdminLSA Login</CardTitle>
              <CardDescription>
                  Please sign in to manage the application.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <Button className="w-full group" onClick={handleLogin} size="lg">
                  <svg className="mr-2 h-5 w-5 group-hover:text-primary transition-colors" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.3 64.5c-24.5-23.4-58.2-38.3-96.6-38.3-84.3 0-152.3 68.2-152.3 152.4s68 152.4 152.3 152.4c97.9 0 130.4-74.5 134.7-109.8H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>
                  Sign in with Google
              </Button>
          </CardContent>
      </Card>
    </div>
  )
}
