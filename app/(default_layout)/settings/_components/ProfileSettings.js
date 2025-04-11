"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Edit, Save } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

const ProfileSettings = ({
  user,
  formData,
  handleInputChange,
  handleSubmitProfile,
  isLoading,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <User className="h-5 w-5 mr-2" />
          Thông tin cá nhân
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitProfile} className="space-y-6">
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>
                {user?.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-2">
              <Button type="button" variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Thay đổi ảnh
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-500"
              >
                Xóa ảnh
              </Button>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullname">Họ và tên</Label>
              <Input
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                placeholder="Họ và tên của bạn"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Tên người dùng</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Tên người dùng"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="email@example.com"
              disabled
            />
            <p className="text-sm text-muted-foreground">
              Email không thể thay đổi sau khi đăng ký.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Mô tả ngắn về bạn"
              rows={4}
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
