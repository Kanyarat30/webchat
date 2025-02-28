"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Eye, EyeOff, LogIn, User, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ChatUI from "../chat/page";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setErrorMessage("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    
    try {
      // Check for hardcoded admin credentials
      if (email === "admin" && password === "admin") {
        // Wait for a short time to simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Redirect to chat page after successful login
        router.push('/chat');  // Assuming ChatUI is at the root route
      } else {
        throw new Error("รหัสผ่านไม่ถูกต้อง");
      }
    } catch (error) {
      setErrorMessage(error.message || "เข้าสู่ระบบไม่สำเร็จ กรุณาลองอีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-400 to-pink-600 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-pink-600">เข้าสู่ระบบ</CardTitle>
          <p className="text-gray-500 mt-2">เข้าสู่ระบบเพื่อใช้บริการแชทประมวลผลภาษาไทย</p>
        </CardHeader>
        
        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="text"
                  id="email"
                  placeholder="ชื่อผู้ใช้"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 py-6 border-2 border-pink-300 focus:border-pink-500 rounded-lg"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-pink-500" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="รหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 py-6 border-2 border-pink-300 focus:border-pink-500 rounded-lg"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-pink-500" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
            
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{errorMessage}</span>
              </div>
            )}
            
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-6 rounded-lg flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    เข้าสู่ระบบ
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 text-center">
          <div className="text-sm text-gray-600">
            ยังไม่มีบัญชีผู้ใช้?{" "}
            <Link href="/signup" className="text-pink-600 hover:text-pink-800 font-medium">
              สมัครสมาชิก
            </Link>
          </div>
          
          <Link href="/forgot-password" className="text-sm text-gray-600 hover:text-pink-600">
            ลืมรหัสผ่าน?
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}