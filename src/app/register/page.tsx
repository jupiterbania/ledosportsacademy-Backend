
"use client";

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { addMember, checkIfMemberExists } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const registerSchema = z.object({
  phone: z.string().optional(),
  dob: z.string().refine((val) => val && !isNaN(Date.parse(val)), { message: "Date of birth is required" }),
  bloodGroup: z.string().min(1, { message: "Blood group is required" }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;


export default function RegisterPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            phone: "",
            dob: "",
            bloodGroup: "",
        },
    });

    React.useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
        if(!loading && user) {
            checkIfMemberExists(user.email!).then(exists => {
                if (exists) {
                    router.push('/');
                }
            })
        }
    }, [user, loading, router]);


    const onSubmit = async (data: RegisterFormValues) => {
        if (!user) {
            toast({ title: "Error", description: "You must be logged in to register.", variant: "destructive" });
            return;
        }

        try {
            await addMember({
                ...data,
                name: user.displayName || 'Unknown',
                email: user.email!,
                photoUrl: user.photoURL || `https://placehold.co/100x100.png`,
                joinDate: new Date().toISOString().split('T')[0],
            });
            toast({ title: "Registration Successful", description: "Welcome to the club!" });
            router.push('/');
        } catch (error) {
            toast({ title: "Registration Failed", description: "Something went wrong.", variant: "destructive" });
        }
    };
    
    if (loading || !user) {
        return (
          <div className="flex items-center justify-center h-screen">
            <div className="text-lg">Loading...</div>
          </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40">
            <Card className="w-full max-w-md mx-4">
                <CardHeader className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary/50">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
                        <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <CardTitle>Welcome, {user.displayName}!</CardTitle>
                    <CardDescription>Please complete your registration to continue.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                             <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="+91 1234567890" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                control={form.control}
                                name="dob"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Date of Birth</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="bloodGroup"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Blood Group</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="A+">A+</SelectItem>
                                            <SelectItem value="A-">A-</SelectItem>
                                            <SelectItem value="B+">B+</SelectItem>
                                            <SelectItem value="B-">B-</SelectItem>
                                            <SelectItem value="AB+">AB+</SelectItem>
                                            <SelectItem value="AB-">AB-</SelectItem>
                                            <SelectItem value="O+">O+</SelectItem>
                                            <SelectItem value="O-">O-</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>
                            <Button type="submit" className="w-full">Complete Registration</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
