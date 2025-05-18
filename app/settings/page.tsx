"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Download, HelpCircle, Link, Mail } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    password: "",
    email: "user@example.com",
    theme: "dark",
    language: "English",
    autoplay: true,
    notifications: { email: true, push: false },
    fontSize: 16,
    highContrast: false,
    dataSharing: false,
  });

  useEffect(() => {
    const storedSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");
    setSettings({
      password: storedSettings.password || "",
      email: storedSettings.email || "user@example.com",
      theme: storedSettings.theme || "dark",
      language: storedSettings.language || "English",
      autoplay: storedSettings.autoplay !== undefined ? storedSettings.autoplay : true,
      notifications: storedSettings.notifications || { email: true, push: false },
      fontSize: storedSettings.fontSize || 16,
      highContrast: storedSettings.highContrast || false,
      dataSharing: storedSettings.dataSharing || false,
    });
  }, []);

  const saveSettings = () => {
    localStorage.setItem("userSettings", JSON.stringify(settings));
    // Apply theme
    document.documentElement.classList.toggle("light", settings.theme === "light");
    document.documentElement.classList.toggle("dark", settings.theme === "dark");
    // Apply font size
    document.documentElement.style.fontSize = `${settings.fontSize}px`;
    // Apply high contrast
    document.documentElement.classList.toggle("high-contrast", settings.highContrast);
  };

  const downloadData = () => {
    const data = {
      userData: JSON.parse(localStorage.getItem("userData") || "{}"),
      myList: JSON.parse(localStorage.getItem("myList") || "[]"),
      viewingHistory: JSON.parse(localStorage.getItem("viewingHistory") || "[]"),
      settings: JSON.parse(localStorage.getItem("userSettings") || "{}"),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cineghar_user_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main className="px-4 md:px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Settings</h1>

          {/* Account Settings */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div>
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={settings.password}
                  onChange={(e) => setSettings({ ...settings, password: e.target.value })}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <Button onClick={saveSettings} className="bg-red-600 hover:bg-red-700">
                Save Account Changes
              </Button>
            </CardContent>
          </Card>

          {/* App Preferences */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Theme</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value) => setSettings({ ...settings, theme: value })}
                >
                  <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label>Language</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => setSettings({ ...settings, language: value })}
                >
                  <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Nepali">Nepali</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label>Autoplay Next Movie</Label>
                <Switch
                  checked={settings.autoplay}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoplay: checked })}
                />
              </div>
              <Button onClick={saveSettings} className="bg-red-600 hover:bg-red-700">
                Save Preferences
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Email Notifications</Label>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, email: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Push Notifications</Label>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, push: checked },
                    })
                  }
                />
              </div>
              <Button onClick={saveSettings} className="bg-red-600 hover:bg-red-700">
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>

          {/* Accessibility */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Accessibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Font Size ({settings.fontSize}px)</Label>
                <Slider
                  value={[settings.fontSize]}
                  min={12}
                  max={20}
                  step={1}
                  onValueChange={(value) => setSettings({ ...settings, fontSize: value[0] })}
                  className="mt-2"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>High Contrast Mode</Label>
                <Switch
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => setSettings({ ...settings, highContrast: checked })}
                />
              </div>
              <Button onClick={saveSettings} className="bg-red-600 hover:bg-red-700">
                Save Accessibility Settings
              </Button>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Share Data for Analytics</Label>
                <Switch
                  checked={settings.dataSharing}
                  onCheckedChange={(checked) => setSettings({ ...settings, dataSharing: checked })}
                />
              </div>
              <Button
                variant="outline"
                className="gap-2"
                onClick={downloadData}
              >
                <Download className="h-4 w-4" />
                Download My Data
              </Button>
              <Button onClick={saveSettings} className="bg-red-600 hover:bg-red-700">
                Save Privacy Settings
              </Button>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Help & Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="gap-2 w-full justify-start">
                <HelpCircle className="h-4 w-4" />
                <Link href="/faq">FAQ</Link>
              </Button>
              <Button variant="outline" className="gap-2 w-full justify-start">
                <Mail className="h-4 w-4" />
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button variant="outline" className="gap-2 w-full justify-start">
                <Link href="/terms">Terms of Service</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}