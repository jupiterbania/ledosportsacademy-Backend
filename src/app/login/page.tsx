"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function LoginPage() {
  const { toast } = useToast();

  const handleLogin = () => {
    // In a real app, this would initiate the Firebase Google Auth flow.
    // For this prototype, we'll just show a toast notification.
    toast({
      title: "Login Initiated",
      description: "Redirecting to Google for authentication...",
    });
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] animate-fade-in">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Admin Login</CardTitle>
          <CardDescription className="pt-2">
            Sign in to access the club's dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={handleLogin} size="lg">
            <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.3 64.5c-24.5-23.4-58.2-38.3-96.6-38.3-84.3 0-152.3 68.2-152.3 152.4s68 152.4 152.3 152.4c97.9 0 130.4-74.5 134.7-109.8H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>
            Sign in with Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
            <Button variant="link" asChild>
                <Link href="/">
                    &larr; Back to Home
                </Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
