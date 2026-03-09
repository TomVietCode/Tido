import React from 'react';
import { Construction, ArrowLeft, Hammer } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';

export default function UserProfilePage() {
  return (
    <div className="flex flex-1 items-center justify-center min-h-[70vh] p-4">
      <Card className="max-w-2xl w-full text-center">
        <CardHeader>
          <div className="mx-auto bg-yellow-100 p-3 rounded-full w-fit mb-4 dark:bg-yellow-900/30">
            <Construction className="h-10 w-10 text-yellow-600 dark:text-yellow-500 animate-bounce" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Chức năng đang phát triển
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Chúng mình đang nỗ lực hoàn thiện tính năng này để mang lại trải nghiệm tốt nhất cho bạn.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Hammer className="h-4 w-4" />
            <span>Dự kiến ra mắt: Sớm thôi!</span>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-primary h-full w-[65%] animate-pulse" />
          </div>
        </CardContent>

        <CardFooter className="flex justify-center pt-2">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại trang chủ
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}