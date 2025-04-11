"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const NotificationSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Thông báo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-medium">Thông báo qua email</h3>
              <p className="text-sm text-muted-foreground">
                Nhận thông báo qua email về các hoạt động mới.
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-medium">Thông báo tin nhắn mới</h3>
              <p className="text-sm text-muted-foreground">
                Nhận thông báo khi có tin nhắn mới.
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-medium">Thông báo người theo dõi mới</h3>
              <p className="text-sm text-muted-foreground">
                Nhận thông báo khi có người theo dõi mới.
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-medium">Thông báo lượt thích bài viết</h3>
              <p className="text-sm text-muted-foreground">
                Nhận thông báo khi có người thích bài viết của bạn.
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
