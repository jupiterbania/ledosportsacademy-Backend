
"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from '@/hooks/use-toast';
import { addAdminRequest, getAdminRequestByEmail, AdminRequest } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle, Clock } from 'lucide-react';


const requestSchema = z.object({
  reason: z.string().min(10, { message: "Please provide a reason for your request (min. 10 characters)." }),
});

type RequestFormValues = z.infer<typeof requestSchema>;

export default function AdminRequestPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [existingRequest, setExistingRequest] = useState<AdminRequest | null>(null);

    const form = useForm<RequestFormValues>({
        resolver: zodResolver(requestSchema),
        defaultValues: {
            reason: "",
        },
    });

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
        if (!loading && user?.email) {
            getAdminRequestByEmail(user.email).then(request => {
                setExistingRequest(request);
            });
        }
    }, [user, loading, router]);


    const onSubmit = async (data: RequestFormValues) => {
        if (!user) {
            toast({ title: "Error", description: "You must be logged in to make a request.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            await addAdminRequest({
                ...data,
                name: user.displayName || 'Unknown',
                email: user.email!,
                photoUrl: user.photoURL || `https://placehold.co/100x100.png`,
            });
            toast({ title: "Request Submitted", description: "Your request for admin access has been sent for approval." });
            const request = await getAdminRequestByEmail(user.email!);
            setExistingRequest(request);
        } catch (error) {
            toast({ title: "Request Failed", description: "Something went wrong.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (loading || !user) {
        return (
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        );
    }
    
    if (existingRequest) {
        return (
             <div className="flex items-center justify-center min-h-screen bg-muted/40 animate-fade-in">
                <Card className="w-full max-w-md mx-4 aurora-card">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-24 h-24 mb-4">
                             {existingRequest.status === 'pending' && <Clock className="w-24 h-24 text-amber-400" />}
                             {existingRequest.status === 'approved' && <CheckCircle className="w-24 h-24 text-green-500" />}
                        </div>
                        <CardTitle>Request Status: <span className="capitalize">{existingRequest.status}</span></CardTitle>
                        <CardDescription>
                            {existingRequest.status === 'pending' && "Your request is awaiting approval. You will be notified once a decision has been made."}
                             {existingRequest.status === 'approved' && "Your request has been approved! You now have admin access."}
                             {existingRequest.status === 'rejected' && "Your request has been reviewed. Please contact the super admin for more details."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" onClick={() => router.push('/')}>
                            Go to Homepage
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40 animate-fade-in">
            <Card className="w-full max-w-md mx-4 aurora-card">
                <CardHeader className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary/50 aurora-glow">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
                        <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="aurora-text-gradient text-3xl">Admin Access Request</CardTitle>
                    <CardDescription>Please provide a reason for requesting admin access.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                             <FormField
                                control={form.control}
                                name="reason"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Reason for Request</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="e.g., I need to manage upcoming events..." {...field} rows={4} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Request
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
