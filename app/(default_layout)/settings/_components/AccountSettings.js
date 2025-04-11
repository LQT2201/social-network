"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const AccountSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Tài khoản
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Mật khẩu</h3>
          <Button variant="outline">Thay đổi mật khẩu</Button>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-red-600">Vùng nguy hiểm</h3>
          <p className="text-sm text-muted-foreground">
            Một khi tài khoản của bạn bị xóa, tất cả tài nguyên và dữ liệu sẽ bị
            xóa vĩnh viễn.
          </p>
          <Button variant="destructive">Xóa tài khoản</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
