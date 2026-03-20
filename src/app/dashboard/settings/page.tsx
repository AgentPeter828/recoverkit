"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { User } from "@supabase/supabase-js";

export default function SettingsPage() {
  const supabase = createBrowserClient();
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (u) {
        setUser(u);
        setFullName(u.user_metadata?.full_name || "");
      }
    });
  }, []);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setMessage("");

    const { error: authError } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        { id: user.id, full_name: fullName, updated_at: new Date().toISOString() },
        { onConflict: "id" }
      );

    if (authError || profileError) {
      setMessage("Failed to save. Please try again.");
    } else {
      setMessage("Saved!");
      const {
        data: { user: updated },
      } = await supabase.auth.getUser();
      if (updated) setUser(updated);
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  }

  if (!user) {
    return (
      <div className="p-8">
        <p style={{ color: "var(--color-text-secondary)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      {/* ─── PROFILE ─── */}
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-6">Profile</h2>

        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white"
              style={{ background: "var(--color-brand)" }}
            >
              {fullName
                ? fullName
                    .split(/\s+/)
                    .map((p) => p[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : user.email?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <p className="font-medium">
                {fullName || user.email?.split("@")[0]}
              </p>
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                {user.email}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Display name</label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
            />
            <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>
              This is shown in the navigation bar and on your account.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <Input type="email" value={user.email || ""} disabled />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            {message && (
              <span
                className="text-sm"
                style={{
                  color: message === "Saved!" ? "var(--color-brand)" : "#ef4444",
                }}
              >
                {message}
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* ─── BILLING LINK ─── */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Billing & Plan</h2>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
              Manage your subscription, upgrade, or view billing details.
            </p>
          </div>
          <Link href="/dashboard/billing">
            <Button variant="outline" size="sm">
              Manage →
            </Button>
          </Link>
        </div>
      </Card>

      {/* ─── DATA & PRIVACY ─── */}
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Data & Privacy</h2>

        <div className="space-y-4">
          {/* Export data */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Export your data</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                Download all your RecoverKit data as a JSON file. Limited to once per hour.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                setMessage("");
                try {
                  const res = await fetch("/api/export");
                  if (res.status === 429) {
                    setMessage("Export rate limited. Try again in an hour.");
                    return;
                  }
                  if (!res.ok) {
                    setMessage("Export failed. Please try again.");
                    return;
                  }
                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `recoverkit-export.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                } catch {
                  setMessage("Export failed. Please try again.");
                }
              }}
            >
              Download
            </Button>
          </div>

          {/* Cookie preferences */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Cookie preferences</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                Change your analytics cookie consent.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                localStorage.removeItem("rk_cookie_consent");
                window.location.reload();
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* ─── DANGER ZONE ─── */}
      <Card className="p-6 border-red-200" style={{ borderColor: "#fecaca" }}>
        <h2 className="text-lg font-semibold mb-1" style={{ color: "#dc2626" }}>
          Danger Zone
        </h2>
        <p className="text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>

        {!showDeleteConfirm ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            style={{ borderColor: "#fecaca", color: "#dc2626" }}
          >
            Delete my account
          </Button>
        ) : (
          <div className="rounded-lg p-4" style={{ background: "#fef2f2" }}>
            <p className="text-sm font-medium mb-3" style={{ color: "#991b1b" }}>
              ⚠️ Are you absolutely sure? This will permanently delete:
            </p>
            <ul className="text-sm mb-4 space-y-1" style={{ color: "#991b1b" }}>
              <li>• Your account and profile</li>
              <li>• All email sequences and templates</li>
              <li>• All recovery campaigns and history</li>
              <li>• All connected Stripe accounts</li>
              <li>• All audit logs</li>
            </ul>
            <p className="text-sm mb-4" style={{ color: "#991b1b" }}>
              Type <strong>DELETE</strong> to confirm:
            </p>
            <div className="flex items-center gap-3">
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="max-w-[200px]"
                style={{ borderColor: "#fecaca" }}
              />
              <Button
                variant="primary"
                size="sm"
                disabled={deleteConfirmText !== "DELETE" || deleting}
                onClick={async () => {
                  setDeleting(true);
                  try {
                    const res = await fetch("/api/account/delete", { method: "DELETE" });
                    if (res.ok) {
                      await supabase.auth.signOut();
                      window.location.href = "/?deleted=true";
                    } else {
                      setMessage("Failed to delete account. Please contact support.");
                      setShowDeleteConfirm(false);
                    }
                  } catch {
                    setMessage("Failed to delete account. Please contact support.");
                    setShowDeleteConfirm(false);
                  } finally {
                    setDeleting(false);
                  }
                }}
                style={{ background: "#dc2626" }}
              >
                {deleting ? "Deleting..." : "Permanently delete"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(""); }}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
