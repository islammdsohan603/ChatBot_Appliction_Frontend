import React,{ useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../../lib/api";
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
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("bio", bio.trim());

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const response = await api.put("/api/user/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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
      <DialogContent className="max-w-lg p-0 overflow-hidden border-line-strong bg-surface/95 backdrop-blur-2xl">
        {/* Glow Header Accent */}
        <div className="h-1 w-full bg-gradient-to-r from-brand-violet via-brand-cyan to-brand-indigo" />

        {/* Modal Header */}
        <DialogHeader className="px-6 pt-5 pb-3 border-b border-line">
          <DialogTitle className="text-lg font-bold text-fg flex items-center gap-2">
            Edit Profile
          </DialogTitle>
          <DialogDescription className="text-xs text-fg-muted">
            Update your public profile details and avatar
          </DialogDescription>
        </DialogHeader>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Avatar Upload Section */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-primary/5 border border-line">
            <div className="relative group">
              <UserAvatar
                name={name || user.name || user.userName || "User"}
                src={previewUrl}
                size="2xl"
                className="ring-4 ring-primary/20 shadow-lg"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
                className="absolute inset-0 rounded-full bg-scrim/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-primary-contrast text-xs gap-1 backdrop-blur-xs cursor-pointer"
                aria-label="Change profile photo"
              >
                <HiOutlineCamera className="w-6 h-6 text-primary-text" />
                <span className="font-semibold text-[11px]">Change</span>
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <h3 className="text-sm font-semibold text-fg">
                Profile Photo
              </h3>
              <p className="text-xs text-fg-muted">
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
                  className="border-primary/25 bg-primary/15 text-primary-text hover:bg-primary/25 hover:text-primary-text"
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
                    className="bg-error/10 text-error-text hover:bg-error/20 hover:text-error-text border border-error/20"
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
                <HiOutlineUser className="w-3.5 h-3.5 text-primary-text" />
                Display Name <span className="text-error-text">*</span>
              </Label>
              <Input
                id="edit-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                disabled={isSubmitting}
                className="h-10 rounded-xl bg-primary/5 border-line-strong text-fg placeholder-fg-muted focus-visible:border-primary/60 focus-visible:ring-primary/20"
              />
            </div>

            {/* Username (Read-Only) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="edit-username"
                  className="flex items-center gap-1.5"
                >
                  <HiOutlineAtSymbol className="w-3.5 h-3.5 text-primary-text" />
                  Username
                </Label>
                <span className="text-[10px] font-semibold text-fg-muted uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-md border border-line">
                  Permanent
                </span>
              </div>
              <Input
                id="edit-username"
                type="text"
                value={user.userName ? `@${user.userName}` : ""}
                disabled
                className="h-10 rounded-xl bg-primary/5 border-line text-fg-muted cursor-not-allowed opacity-80"
              />
            </div>

            {/* Email Address (Read-Only) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="edit-email"
                  className="flex items-center gap-1.5"
                >
                  <HiOutlineEnvelope className="w-3.5 h-3.5 text-primary-text" />
                  Email Address
                </Label>
                <span className="text-[10px] font-semibold text-fg-muted uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-md border border-line">
                  Verified
                </span>
              </div>
              <Input
                id="edit-email"
                type="email"
                value={user.email || ""}
                disabled
                className="h-10 rounded-xl bg-primary/5 border-line text-fg-muted cursor-not-allowed opacity-80"
              />
            </div>

            {/* Bio / About */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="edit-bio"
                  className="flex items-center gap-1.5"
                >
                  <HiOutlineDocumentText className="w-3.5 h-3.5 text-primary-text" />
                  Bio
                </Label>
                <span className="text-[11px] text-fg-muted">
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
                className="rounded-xl bg-primary/5 border-line-strong text-fg placeholder-fg-muted focus:border-primary/60 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <DialogFooter className="flex items-center justify-end gap-3 pt-4 border-t border-line">
            <Button
              type="button"
              variant="outline"
              onClick={() => !isSubmitting && onClose?.()}
              disabled={isSubmitting}
              className="rounded-xl border-line-strong text-fg-secondary hover:bg-surface-hover hover:text-fg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn-accent rounded-xl text-primary-contrast shadow-lg shadow-primary/25 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-line-strong border-t-line-strong rounded-full animate-spin mr-2" />
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


 
