"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  User as UserIcon,
  Shield,
  Save,
  Lock,
  Loader2,
  AlertCircle,
  Camera,
  Upload,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RootState } from "@/redux/store";
import { setUser } from "@/redux/fetchers/auth/authSlice";
import {
  useChangePasswordMutation,
  useMeQuery,
  useUpdateMeMutation,
  useUpdateMyPhotoMutation,
} from "@/redux/fetchers/auth/authApi";

export default function AccountPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth?.token);
  const authUser = useSelector((state: RootState) => state.auth?.user);

  useEffect(() => {
    if (!token) router.replace("/login");
  }, [token, router]);

  const { data, isLoading, isError, refetch } = useMeQuery(undefined, {
    skip: !token,
  });
  const [updateMe, { isLoading: updating }] = useUpdateMeMutation();
  const [updateMyPhoto, { isLoading: uploadingPhoto }] =
    useUpdateMyPhotoMutation();
  const [changePassword, { isLoading: changingPassword }] =
    useChangePasswordMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const me = data?.data;

  const [profile, setProfile] = useState({ full_name: "", email: "" });
  const [pwd, setPwd] = useState({ old_password: "", new_password: "", confirm: "" });

  useEffect(() => {
    if (me) {
      setProfile({
        full_name: me.full_name || "",
        email: me.email || "",
      });
    }
  }, [me]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handlePwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPwd((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload: { full_name?: string; email?: string } = {};
    if (profile.full_name.trim() && profile.full_name !== me?.full_name)
      payload.full_name = profile.full_name.trim();
    if (profile.email.trim() && profile.email !== me?.email)
      payload.email = profile.email.trim();

    if (!Object.keys(payload).length) {
      toast.info("Nothing to update");
      return;
    }

    try {
      const res = await updateMe(payload).unwrap();
      toast.success("Profile updated");
      if (authUser && token) {
        dispatch(
          setUser({
            user: {
              ...authUser,
              name: res.data?.full_name || authUser.name,
              email: res.data?.email || authUser.email,
            },
            token,
          })
        );
      }
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setPendingFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handlePhotoCancel = () => {
    setPendingFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePhotoUpload = async () => {
    if (!pendingFile) return;
    const formData = new FormData();
    formData.append("file", pendingFile);
    try {
      await updateMyPhoto(formData).unwrap();
      toast.success("Profile photo updated");
      handlePhotoCancel();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Photo upload failed");
    }
  };

  const handlePwdSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (pwd.new_password.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (pwd.new_password !== pwd.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await changePassword({
        old_password: pwd.old_password,
        new_password: pwd.new_password,
      }).unwrap();
      toast.success("Password changed");
      setPwd({ old_password: "", new_password: "", confirm: "" });
    } catch (err: any) {
      toast.error(err?.data?.message || "Password change failed");
    }
  };

  if (!token) return null;

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#1C398E]" />
      </div>
    );
  }

  if (isError || !me) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
        <p className="text-slate-700 mb-4">Failed to load account.</p>
        <Button asChild variant="outline">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    );
  }

  const initials = (me.full_name || "U")
    .split(" ")
    .map((s: string) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-screen">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
        

        <div className="grid lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Profile form */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-transparent">
                <div className="h-9 w-9 rounded-xl bg-[#1C398E] text-white flex items-center justify-center">
                  <Camera className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Profile Photo
                  </h2>
                  <p className="text-xs text-slate-500">
                    Upload an image (max 5MB, JPG/PNG)
                  </p>
                </div>
              </div>
              <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative">
                    {photoPreview || me.profile_photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photoPreview || me.profile_photo}
                        alt="Profile"
                        className="h-24 w-24 rounded-full object-cover ring-4 ring-slate-100 border border-slate-200"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-[#1C398E] text-white flex items-center justify-center text-2xl font-semibold ring-4 ring-slate-100">
                        {initials}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-[#1C398E] hover:bg-[#1C398E]/90 text-white flex items-center justify-center shadow-md ring-2 ring-white transition"
                      title="Change photo"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex-1 w-full space-y-2 text-center sm:text-left">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoSelect}
                    />
                    {pendingFile ? (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          type="button"
                          onClick={handlePhotoUpload}
                          disabled={uploadingPhoto}
                          className="bg-[#1C398E] hover:bg-[#1C398E]/90"
                        >
                          {uploadingPhoto ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Uploading...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Upload className="h-4 w-4" />
                              Save Photo
                            </span>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePhotoCancel}
                          disabled={uploadingPhoto}
                          className="border-slate-200"
                        >
                          <X className="h-4 w-4 mr-1.5" />
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="border-slate-200"
                        >
                          <Upload className="h-4 w-4 mr-1.5" />
                          Choose Image
                        </Button>
                        <p className="text-xs text-slate-500">
                          Click the camera icon or button to select a new
                          profile photo.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-transparent">
                <div className="h-9 w-9 rounded-xl bg-[#1C398E] text-white flex items-center justify-center">
                  <UserIcon className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Profile Information
                  </h2>
                  <p className="text-xs text-slate-500">Update your name and email</p>
                </div>
              </div>
              <form onSubmit={handleProfileSubmit}>
                <CardContent className="p-5 sm:p-6 space-y-4">
                  <div>
                    <Label htmlFor="full_name" className="text-sm font-medium text-slate-700 mb-1.5 block">
                      Full name
                    </Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      <Input
                        id="full_name"
                        name="full_name"
                        value={profile.full_name}
                        onChange={handleProfileChange}
                        required
                        className="pl-9 h-11 bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:border-[#1C398E]"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700 mb-1.5 block">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        required
                        className="pl-9 h-11 bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:border-[#1C398E]"
                      />
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <Button
                      type="submit"
                      disabled={updating}
                      className="bg-[#1C398E] hover:bg-[#1C398E]/90"
                    >
                      {updating ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Save Changes
                        </span>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </form>
            </Card>

            <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-transparent">
                <div className="h-9 w-9 rounded-xl bg-[#1C398E] text-white flex items-center justify-center">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Change Password
                  </h2>
                  <p className="text-xs text-slate-500">Use at least 6 characters</p>
                </div>
              </div>
              <form onSubmit={handlePwdSubmit}>
                <CardContent className="p-5 sm:p-6 space-y-4">
                  <div>
                    <Label htmlFor="old_password" className="text-sm font-medium text-slate-700 mb-1.5 block">
                      Current password
                    </Label>
                    <Input
                      id="old_password"
                      name="old_password"
                      type="password"
                      value={pwd.old_password}
                      onChange={handlePwdChange}
                      required
                      className="h-11 bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:border-[#1C398E]"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="new_password" className="text-sm font-medium text-slate-700 mb-1.5 block">
                        New password
                      </Label>
                      <Input
                        id="new_password"
                        name="new_password"
                        type="password"
                        value={pwd.new_password}
                        onChange={handlePwdChange}
                        required
                        className="h-11 bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:border-[#1C398E]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirm" className="text-sm font-medium text-slate-700 mb-1.5 block">
                        Confirm new password
                      </Label>
                      <Input
                        id="confirm"
                        name="confirm"
                        type="password"
                        value={pwd.confirm}
                        onChange={handlePwdChange}
                        required
                        className="h-11 bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:border-[#1C398E]"
                      />
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <Button
                      type="submit"
                      disabled={changingPassword}
                      className="bg-[#1C398E] hover:bg-[#1C398E]/90"
                    >
                      {changingPassword ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Updating...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Change Password
                        </span>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </form>
            </Card>
          </div>

          {/* Meta card */}
          <div className="lg:col-span-1">
            <Card className="border-slate-200 shadow-sm rounded-2xl sticky top-24">
              <CardContent className="p-5 sm:p-6 space-y-4">
                <h3 className="font-bold text-slate-900">Account Details</h3>
                <Separator />
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">User ID</p>
                    <p className="text-slate-800 break-all font-mono text-xs">
                      {me.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Role</p>
                    <p className="text-slate-800">{me.role}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Joined</p>
                    <p className="text-slate-800">
                      {me.createdAt
                        ? new Date(me.createdAt).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Last updated</p>
                    <p className="text-slate-800">
                      {me.updatedAt
                        ? new Date(me.updatedAt).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>
                {me.role === "ADMIN" && (
                  <>
                    <Separator />
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-[#1C398E]/30 text-[#1C398E] hover:bg-blue-50"
                    >
                      <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
