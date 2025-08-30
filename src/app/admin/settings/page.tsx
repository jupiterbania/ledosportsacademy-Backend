

"use client";

import React, { useState, useEffect } from 'react';
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
import { getMemberByEmail, updateMemberByEmail, Member } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';


const profileSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  phone: z.string().optional(),
  dob: z.string().optional(),
  bloodGroup: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;


export default function ProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [member, setMember] = useState<Member | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            phone: "",
            dob: "",
            bloodGroup: "",
        },
    });

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
        if(!loading && user?.email) {
            getMemberByEmail(user.email).then(memberData => {
                if (memberData) {
                    setMember(memberData);
                    form.reset({
                        name: memberData.name,
                        phone: memberData.phone || "",
                        dob: memberData.dob || "",
                        bloodGroup: memberData.bloodGroup || "",
                    });
                } else {
                    router.push('/admin');
                }
            })
        }
    }, [user, loading, router, form]);


    const onSubmit = async (data: ProfileFormValues) => {
        if (!user?.email) {
            toast({ title: "Error", description: "You must be logged in to update your profile.", variant: "destructive" });
            return;
        }
        setIsSubmitting(true);
        try {
            await updateMemberByEmail(user.email, data);
            toast({ title: "Profile Updated", description: "Your information has been saved." });
        } catch (error) {
            toast({ title: "Update Failed", description: "Something went wrong.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (loading || !user || !member) {
        return (
          <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col gap-4 md:gap-8">
             <div className="max-w-2xl w-full">
                <Card className="aurora-card">
                    <CardHeader className="text-center">
                        <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary/50 ring-4 ring-primary/20 aurora-glow">
                            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
                            <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="aurora-text-gradient text-3xl">My Profile</CardTitle>
                        <CardDescription>View and edit your personal information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your full name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                     {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
             </div>
        </div>
    )
}
