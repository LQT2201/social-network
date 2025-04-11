"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const PrivacySettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Lock className="h-5 w-5 mr-2" />
          Bảo mật & Quyền riêng tư
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-medium">Tài khoản riêng tư</h3>
              <p className="text-sm text-muted-foreground">
                Khi bật, chỉ người theo dõi của bạn mới có thể xem bài viết của
                bạn.
              </p>
            </div>
            <Switch />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-medium">Hiển thị trạng thái hoạt động</h3>
              <p className="text-sm text-muted-foreground">
                Cho phép người khác thấy khi bạn đang hoạt động.
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-medium">Xác thực hai yếu tố</h3>
              <p className="text-sm text-muted-foreground">
                Bảo vệ tài khoản của bạn với xác thực hai yếu tố.
              </p>
            </div>
            <Button variant="outline" size="sm">
              Thiết lập
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;
