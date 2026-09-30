import React,{ useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { setUserData } from "../../../redux/userSlice";
import UserAvatar from "../ui/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  HiOutlineCamera,
  HiOutlineUser,
  HiOutlineAtSymbol,
  HiOutlineEnvelope,
  HiOutlineDocumentText,
  HiOutlineCheck,
  HiOutlineTrash,
} from "react-icons/hi2";

export function EditProfile({ isOpen, onClose }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const user = userData?.user || userData || {};
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  // Sync state with current user data when opened
  useEffect(() => {
    if (isOpen && user) {
      setName(user.name || user.userName || "");
      setBio(user.bio || "");
      setSelectedFile(null);
      setPreviewUrl(user.image || null);
    }
  }, [isOpen, user]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size should be less than 5MB");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Display name cannot be empty");
      return;
    }

    setIsSubmitting(true);

    try {
      const serverUrl =
        import.meta.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("bio", bio.trim());

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const response = await axios.put(
        `${serverUrl}/api/user/profile`,
        formData,
        {
          withCredentials: true,
        }
      );

      const updatedUser = response.data;
      dispatch(setUserData(updatedUser));
      toast.success("Profile updated successfully!");
      onClose?.();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose?.()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden border-violet-200/80 dark:border-violet-500/20 bg-white/95 dark:bg-[#0d1230]/95 backdrop-blur-2xl">
        {/* Glow Header Accent */}
        <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-cyan-400 to-indigo-500" />

        {/* Modal Header */}
        <DialogHeader className="px-6 pt-5 pb-3 border-b border-violet-500/10">
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            Edit Profile
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            Update your public profile details and avatar
          </DialogDescription>
        </DialogHeader>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Avatar Upload Section */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-violet-500/5 border border-violet-500/10">
            <div className="relative group">
              <UserAvatar
                name={name || user.name || user.userName || "User"}
                src={previewUrl}
                size="2xl"
                className="ring-4 ring-violet-500/20 shadow-lg"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs gap-1 backdrop-blur-xs cursor-pointer"
                aria-label="Change profile photo"
              >
                <HiOutlineCamera className="w-6 h-6 text-violet-300" />
                <span className="font-semibold text-[11px]">Change</span>
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                Profile Photo
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Accepts PNG, JPG, or WebP. Max size 5MB.
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting}
                  className="border-violet-500/25 bg-violet-500/15 text-violet-600 dark:text-violet-300 hover:bg-violet-500/25 hover:text-violet-900 dark:hover:text-white"
                >
                  <HiOutlineCamera className="w-3.5 h-3.5 mr-1.5" />
                  Upload New
                </Button>
                {(selectedFile || previewUrl) && (
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={handleRemovePhoto}
                    disabled={isSubmitting}
                    className="bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 hover:text-red-700 dark:hover:text-red-300 border border-red-500/20"
                  >
                    <HiOutlineTrash className="w-3.5 h-3.5 mr-1.5" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Display Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="edit-name"
                className="flex items-center gap-1.5"
              >
                <HiOutlineUser className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
                Display Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                disabled={isSubmitting}
                className="h-10 rounded-xl bg-violet-500/5 border-violet-500/20 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus-visible:border-violet-500/60 focus-visible:ring-violet-500/20"
              />
            </div>

            {/* Username (Read-Only) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="edit-username"
                  className="flex items-center gap-1.5"
                >
                  <HiOutlineAtSymbol className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
                  Username
                </Label>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-violet-500/10 px-2 py-0.5 rounded-md border border-violet-500/15">
                  Permanent
                </span>
              </div>
              <Input
                id="edit-username"
                type="text"
                value={user.userName ? `@${user.userName}` : ""}
                disabled
                className="h-10 rounded-xl bg-violet-500/5 border-violet-500/10 text-slate-500 dark:text-slate-400 cursor-not-allowed opacity-80"
              />
            </div>

            {/* Email Address (Read-Only) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="edit-email"
                  className="flex items-center gap-1.5"
                >
                  <HiOutlineEnvelope className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
                  Email Address
                </Label>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-violet-500/10 px-2 py-0.5 rounded-md border border-violet-500/15">
                  Verified
                </span>
              </div>
              <Input
                id="edit-email"
                type="email"
                value={user.email || ""}
                disabled
                className="h-10 rounded-xl bg-violet-500/5 border-violet-500/10 text-slate-500 dark:text-slate-400 cursor-not-allowed opacity-80"
              />
            </div>

            {/* Bio / About */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="edit-bio"
                  className="flex items-center gap-1.5"
                >
                  <HiOutlineDocumentText className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
                  Bio
                </Label>
                <span className="text-[11px] text-slate-500">
                  {bio.length}/160
                </span>
              </div>
              <Textarea
                id="edit-bio"
                rows={3}
                maxLength={160}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a little bit about yourself..."
                disabled={isSubmitting}
                className="rounded-xl bg-violet-500/5 border-violet-500/20 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-violet-500/60 focus:ring-violet-500/20"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <DialogFooter className="flex items-center justify-end gap-3 pt-4 border-t border-violet-500/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => !isSubmitting && onClose?.()}
              disabled={isSubmitting}
              className="rounded-xl border-slate-300 dark:border-violet-500/20 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-violet-500/10 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn-accent rounded-xl text-white shadow-lg shadow-violet-500/25 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <HiOutlineCheck className="w-4 h-4 mr-1.5" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditProfile;


 
