"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { api } from "@/lib/axios";
import { Settings, User, Mail, FileText, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.put("/users/profile", { username: formData.username, bio: formData.bio });
      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto p-6 pt-8">
        <div className="flex items-center space-x-3 mb-8">
          <Settings className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences</p>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-8">
          <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-muted rounded-lg border-0 focus:ring-2 focus:ring-primary"
                  placeholder="Your username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="w-full pl-10 pr-4 py-3 bg-muted rounded-lg border-0 focus:ring-2 focus:ring-primary opacity-50 cursor-not-allowed"
                  placeholder="Your email"
                  disabled
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-muted-foreground w-5 h-5" />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 bg-muted rounded-lg border-0 focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 text-green-600 text-sm p-3 rounded-lg">
                {success}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}