"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, MessageCircle, ArrowRight, Bookmark } from "lucide-react";

interface LostItemCardProps {
  title: string;
  location: string;
  time: string;
  imageUrl: string;
  status?: "lost" | "found";
  reward?: boolean;
}

export default function LostItemCard({
  title = "Ví da màu đen",
  location = "Thư viện",
  time = "Khoảng 10:00 sáng",
  imageUrl = "/placeholder.png",
  status = "lost",
  reward = false,
}: LostItemCardProps) {
  return (
    <Card className="w-[320px] rounded-2xl py-0">
      <CardContent className="p-4">
        {/* Image */}
        <div className="relative">
          <Image
            src={imageUrl}
            alt={title}
            width={320}
            height={180}
            className="h-40 w-full rounded-xl object-cover"
          />

          <Badge
            className={`absolute left-3 top-3 ${
              status === "lost" ? "bg-red-500" : "bg-emerald-500"
            }`}
          >
            {status === "lost" ? "Mất đồ" : "Nhặt được"}
          </Badge>

          <Button
            size="icon"
            variant="secondary"
            className="absolute right-3 top-3 h-8 w-8 rounded-full"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>

        {/* Info */}
        <div className="mt-3 space-y-2">
          {reward && (
            <Badge variant="secondary" className="w-fit">
              🎁 Có hậu tạ
            </Badge>
          )}

          <h3 className="text-base font-semibold">{title}</h3>

          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {location}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {time}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-3">
          <Button className="flex-1 gap-2">
            <MessageCircle className="h-4 w-4" />
            Liên hệ
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            Chi tiết
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
