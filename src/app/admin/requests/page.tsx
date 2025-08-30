
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { getAllAdminRequests, updateAdminRequestStatus, AdminRequest } from "@/lib/data";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const { toast } = useToast();

  const fetchRequests = async () => {
    const data = await getAllAdminRequests();
    setRequests(data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateRequest = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateAdminRequestStatus(id, status);
      fetchRequests();
      toast({
        title: `Request ${status}`,
        description: `The admin access request has been successfully ${status}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the request status.",
        variant: "destructive",
      });
    }
  };

  const RequestTable = ({ status }: { status: 'pending' | 'approved' | 'rejected' }) => {
    const filteredRequests = requests.filter(req => req.status === status);

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Requested On</TableHead>
            {status === 'pending' && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.length > 0 ? filteredRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={request.photoUrl} alt={request.name} />
                    <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{request.name}</p>
                    <p className="text-sm text-muted-foreground">{request.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{request.reason}</TableCell>
              <TableCell>
                {request.requestedAt ? new Date((request.requestedAt as any).seconds * 1000).toLocaleString() : 'N/A'}
              </TableCell>
              {status === 'pending' && (
                <TableCell>
                  <div className="flex gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="outline" className="text-green-500 border-green-500 hover:bg-green-500/10 hover:text-green-600">
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Approve</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Approve Request?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will grant admin access to {request.name}. Are you sure?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleUpdateRequest(request.id, 'approved')}>Approve</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                       <AlertDialogTrigger asChild>
                          <Button size="icon" variant="destructive">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Reject</span>
                          </Button>
                       </AlertDialogTrigger>
                       <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reject Request?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will reject the admin access request for {request.name}. Are you sure?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleUpdateRequest(request.id, 'rejected')}>Reject</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              )}
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24">
                No {status} requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };

  const getCount = (status: 'pending' | 'approved' | 'rejected') => {
      return requests.filter(req => req.status === status).length;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Admin Access Requests</CardTitle>
          <CardDescription>
            Manage requests from users who want to become administrators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">
                Pending <Badge variant="secondary" className="ml-2">{getCount('pending')}</Badge>
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved <Badge variant="secondary" className="ml-2">{getCount('approved')}</Badge>
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected <Badge variant="secondary" className="ml-2">{getCount('rejected')}</Badge>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              <RequestTable status="pending" />
            </TabsContent>
            <TabsContent value="approved">
              <RequestTable status="approved" />
            </TabsContent>
            <TabsContent value="rejected">
              <RequestTable status="rejected" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
