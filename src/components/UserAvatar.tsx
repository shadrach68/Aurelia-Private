interface UserAvatarProps {
  fullName: string;
  avatarUrl?: string | null;
  sizeClass?: string;
  textSizeClass?: string;
}

export default function UserAvatar({
  fullName,
  avatarUrl,
  sizeClass = "w-11 h-11",
  textSizeClass = "text-sm",
}: UserAvatarProps) {
  const initials = (fullName || "Private Client")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={fullName}
        className={`${sizeClass} rounded-full object-cover border border-[#C5A46D]/60`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} ${textSizeClass} rounded-full bg-[#C5A46D] flex items-center justify-center text-black font-bold select-none`}
    >
      {initials}
    </div>
  );
}
