
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const settingsSchema = z.object({
  displayName: z.string().min(1, "Display name is required"),
  email: z.string().email("Invalid email address"),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { setTheme, theme } = useTheme();

  const themes = [
    { name: 'Default', value: 'light' },
    { name: 'Dark', value: 'dark' },
    { name: 'Green (Dark)', value: 'dark-green' },
    { name: 'Orange (Dark)', value: 'dark-orange' },
  ];

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      displayName: user?.displayName || "",
      email: user?.email || "",
    },
  });

  const onSubmit = (data: SettingsFormValues) => {
    console.log(data);
    toast({
      title: "Settings Saved",
      description: "Your profile information has been updated. (Frontend only)",
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="max-w-3xl mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your admin account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.photoURL || undefined} alt="Admin" />
                <AvatarFallback>{user?.displayName?.charAt(0) || 'A'}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{user?.displayName}</h3>
                <p className="text-muted-foreground">{user?.email}</p>
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

        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Customize the appearance of the application.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {themes.map((t) => (
                         <Button
                            key={t.value}
                            variant="outline"
                            className={cn(
                                "h-24 justify-start p-4",
                                theme === t.value && "border-2 border-primary"
                            )}
                            onClick={() => setTheme(t.value)}
                        >
                            <div className="flex items-start gap-4">
                                <div
                                className={cn(
                                    "flex h-5 w-5 items-center justify-center rounded-full border",
                                    theme === t.value ? "border-primary" : "border-muted-foreground"
                                )}
                                >
                                {theme === t.value && (
                                    <Check className="h-4 w-4 text-primary" />
                                )}
                                </div>
                                <div className="text-left">
                                     <p className="font-semibold">{t.name}</p>
                                     <p className="text-xs text-muted-foreground">Apply theme</p>
                                </div>
                           </div>
                       </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
