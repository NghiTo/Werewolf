import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type React from "react";
import { useState } from "react";
import admin from "../../database/admin.json";
import { useAuthStore } from "@/store/authStore";

const LoginModal = () => {
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500))
    if (password !== admin.password) {
      setError("Incorrect password");
      setIsLoading(false)
      return;
    }
    login(); 
    setError("");
    setIsLoading(false)
  };
  return (
    <Dialog open={!isLoggedIn}>
      <DialogContent className="sm:max-w-sm [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>🐺 Werewolf</DialogTitle>
          <DialogDescription>For game master only</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              onFocus={() => setError("")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-destructive">{error}</p>}
          </div>
          <DialogFooter className="pt-2">
            <Button type="submit" className="w-full" disabled={isLoading || !password.trim()}>
              {isLoading ? "Loading..." : "Log in"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
