import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "@/context/AuthContext";
import { URL } from "@/api";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Login() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Auto-fill feature for portfolio reviewers
  const handleDemoFill = (role) => {
    if (role === "admin") {
      setUsername("admin_demo");
      setPassword("AdminPass123!");
    } else {
      setUsername("user_demo");
      setPassword("UserPass123!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Set a timer to notify the user if Render's free tier is cold booting
    const wakeUpTimer = setTimeout(() => {
      setIsWakingUp(true);
    }, 4000);

    try {
      const res = await fetch(`${URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      setUser(data.user || data);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      clearTimeout(wakeUpTimer);
      setLoading(false);
      setIsWakingUp(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      
      {/* 💡 Info Alert Badge for Portfolio Reviewers */}
      <div className="w-[400px] mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm text-sm text-blue-800">
        <p className="font-semibold mb-2 flex items-center gap-1">
          👋 Portfolio Reviewer Accounts:
        </p>
        <p className="mb-3 text-xs text-blue-700">
          Click a button below to automatically fill the fields and test different authorization permissions.
        </p>
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            className="bg-white border-blue-300 text-blue-700 hover:bg-blue-100"
            onClick={() => handleDemoFill("admin")}
          >
            🔑 Fill Admin
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            className="bg-white border-blue-300 text-blue-700 hover:bg-blue-100"
            onClick={() => handleDemoFill("user")}
          >
            👤 Fill Standard User
          </Button>
        </div>
      </div>

      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">Connexion</CardTitle>
          <CardDescription className="text-center">
            Access your secure portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-2 text-sm font-medium">{error}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="py-3">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Votre nom d'utilisateur"
                required
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="password" className="pt-1 pb-3">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                required
                disabled={loading}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {isWakingUp 
                ? "Waking up cloud server (takes ~1m)..." 
                : loading 
                ? "Connecting..." 
                : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
