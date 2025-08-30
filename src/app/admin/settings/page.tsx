
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateMemberByEmail } from "@/lib/data";
import { useEffect } from "react";

const settingsSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  email: z.string().email("Invalid email address"),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { toast } = useToast();
  const { user, member } = useAuth();
  
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      displayName: "",
      email: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        displayName: user.displayName || "",
        email: user.email || "",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: SettingsFormValues) => {
    if (!user?.email) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive"});
      return;
    }
    try {
      await updateMemberByEmail(user.email, { name: data.displayName });
      // Note: Updating the displayName in Firebase Auth requires re-authentication or a backend function.
      // We are updating it in our 'members' collection which is used throughout the app.
      toast({
        title: "Settings Saved",
        description: "Your profile information has been updated.",
      });
    } catch (error) {
       toast({
        title: "Error",
        description: "Could not save settings.",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      <div className="max-w-3xl w-full">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your admin account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.photoURL || undefined} alt="Admin" />
                <AvatarFallback>{user.displayName?.charAt(0) || 'A'}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{user.displayName}</h3>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Save Changes</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
