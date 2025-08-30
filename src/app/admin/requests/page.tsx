
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { getAllAdminRequests, updateAdminRequestStatus, AdminRequest } from "@/lib/data";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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

  const RequestList = ({ status }: { status: 'pending' | 'approved' | 'rejected' }) => {
    const filteredRequests = requests.filter(req => req.status === status);
    
    if (filteredRequests.length === 0) {
        return (
            <div className="text-center h-24 flex items-center justify-center text-muted-foreground">
                No {status} requests found.
            </div>
        )
    }

    const RequestActions = ({ request }: { request: AdminRequest}) => (
      <div className="flex gap-2">
        {request.status === 'pending' && (
          <>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-green-500 border-green-500 hover:bg-green-500/10 hover:text-green-600">
                  Approve
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Approve Request?</AlertDialogTitle><AlertDialogDescription>This will grant admin access to {request.name}. Are you sure?</AlertDialogDescription></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleUpdateRequest(request.id, 'approved')}>Approve</AlertDialogAction></AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild><Button size="sm" variant="destructive">Reject</Button></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Reject Request?</AlertDialogTitle><AlertDialogDescription>This will reject the admin access request for {request.name}. Are you sure?</AlertDialogDescription></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleUpdateRequest(request.id, 'rejected')}>Reject</AlertDialogAction></AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
        {request.status === 'approved' && (
          <AlertDialog>
            <AlertDialogTrigger asChild><Button size="sm" variant="destructive">Revoke</Button></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader><AlertDialogTitle>Revoke Admin Access?</AlertDialogTitle><AlertDialogDescription>This will remove admin privileges from {request.name}. Are you sure?</AlertDialogDescription></AlertDialogHeader>
              <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleUpdateRequest(request.id, 'rejected')}>Revoke</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {request.status === 'rejected' && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline" className="text-green-500 border-green-500 hover:bg-green-500/10 hover:text-green-600">
                Approve
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader><AlertDialogTitle>Approve Request?</AlertDialogTitle><AlertDialogDescription>This will grant admin access to {request.name}. Are you sure?</AlertDialogDescription></AlertDialogHeader>
              <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleUpdateRequest(request.id, 'approved')}>Approve</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    )

    return (
        <div>
            {/* Mobile View */}
            <div className="grid gap-4 md:hidden">
                {filteredRequests.map(request => (
                    <Card key={request.id}>
                        <CardHeader>
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
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <h4 className="text-sm font-semibold">Reason</h4>
                                <p className="text-sm text-muted-foreground">{request.reason}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold">Requested On</h4>
                                <p className="text-sm text-muted-foreground">{request.requestedAt ? new Date((request.requestedAt as any).seconds * 1000).toLocaleString() : 'N/A'}</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <RequestActions request={request} />
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Requested On</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRequests.map((request) => (
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
                            <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                            <TableCell>
                                {request.requestedAt ? new Date((request.requestedAt as any).seconds * 1000).toLocaleString() : 'N/A'}
                            </TableCell>
                            <TableCell>
                                <RequestActions request={request} />
                            </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
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
            <TabsList className="grid w-full grid-cols-3">
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
              <RequestList status="pending" />
            </TabsContent>
            <TabsContent value="approved">
              <RequestList status="approved" />
            </TabsContent>
            <TabsContent value="rejected">
              <RequestList status="rejected" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
