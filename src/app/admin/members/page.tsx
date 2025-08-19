
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getAllMembers, Member, addMember, updateMember, deleteMember } from "@/lib/data";
import { PlusCircle, Edit, Trash2, Calendar, Droplets } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const memberSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  photoUrl: z.string().url({ message: "Please enter a valid URL." }),
  phone: z.string().optional(),
  dob: z.string().optional(),
  bloodGroup: z.string().optional(),
});

type MemberFormValues = z.infer<typeof memberSchema>;

function calculateAge(dob: string) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default function MembersManagementPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchMembers = async () => {
    const data = await getAllMembers();
    setMembers(data);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: "",
      email: "",
      photoUrl: "https://placehold.co/100x100.png",
      phone: "",
      dob: "",
      bloodGroup: "",
    },
  });

  const onSubmit = async (data: MemberFormValues) => {
    const { id, ...memberData } = data;
    try {
      if (id) {
        await updateMember(id, memberData);
        toast({ title: "Member Updated", description: "The member's details have been updated." });
      } else {
        const newMemberData = {
          ...memberData,
          joinDate: new Date().toISOString().split('T')[0],
        };
        await addMember(newMemberData);
        toast({ title: "Member Added", description: "The new member has been added." });
      }
      fetchMembers();
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    }
  };

  const handleEdit = (member: Member) => {
    form.reset({
      ...member,
      dob: member.dob || '',
    });
    setIsDialogOpen(true);
  };
  
  const handleDelete = async (id: string) => {
    try {
      await deleteMember(id);
      fetchMembers();
      toast({ title: "Member Removed", description: "The member has been removed from the club.", variant: "destructive" });
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    }
  };

  const MemberActions = ({ member }: { member: Member}) => (
     <div className="flex gap-2">
       <Button variant="outline" size="icon" onClick={() => handleEdit(member)}>
        <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
      </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove the member.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDelete(member.id)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Members Management</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
               <Button onClick={() => {
                  form.reset({
                    id: undefined,
                    name: "",
                    email: "",
                    photoUrl: `https://placehold.co/100x100.png`,
                    phone: "",
                    dob: "",
                    bloodGroup: "",
                  });
                  setIsDialogOpen(true);
                }}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>{form.getValues("id") ? 'Edit Member' : 'Add New Member'}</DialogTitle>
              </DialogHeader>
               <div className="flex-grow overflow-y-auto pr-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
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
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="member@example.com" {...field} />
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
                    <FormField
                      control={form.control}
                      name="photoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Photo URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://placehold.co/100x100.png" {...field} />
                          </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter className="sticky bottom-0 bg-background py-4 -mx-6 px-6 border-t">
                      <DialogClose asChild>
                        <Button type="button" variant="ghost">Cancel</Button>
                      </DialogClose>
                      <Button type="submit">Save Member</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {/* Mobile View - Cards */}
          <div className="grid gap-4 md:hidden">
            {members.map((member) => (
              <Card key={member.id}>
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.photoUrl} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                   <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Joined: {new Date(member.joinDate).toLocaleDateString()}</span>
                   </div>
                   <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Age:</span>
                        <Badge variant="outline">{member.dob ? calculateAge(member.dob) : 'N/A'}</Badge>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Blood:</span>
                        <Badge variant="outline" className="flex items-center">
                          <Droplets className="mr-1 h-3 w-3 text-red-500" />
                          {member.bloodGroup || 'N/A'}
                        </Badge>
                      </div>
                   </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                   <MemberActions member={member} />
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                        <div className="flex items-center gap-4">
                           <Avatar>
                             <AvatarImage src={member.photoUrl} alt={member.name} />
                             <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                           </Avatar>
                           <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-muted-foreground truncate">{member.email}</div>
                           </div>
                        </div>
                    </TableCell>
                    <TableCell>{new Date(member.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell>{member.dob ? calculateAge(member.dob) : 'N/A'}</TableCell>
                    <TableCell>{member.bloodGroup || 'N/A'}</TableCell>
                    <TableCell>
                      <MemberActions member={member} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
    
