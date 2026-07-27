import type { SVGProps } from 'react';
import { SiSnapchat, SiTiktok } from 'react-icons/si';
import type { SocialProfileId } from '../data/socialProfiles';

interface SocialPlatformIconProps extends SVGProps<SVGSVGElement> {
  id: SocialProfileId;
}

export default function SocialPlatformIcon({
  id,
  className,
  ...props
}: SocialPlatformIconProps) {
  if (id === 'snapchat') {
    return <SiSnapchat className={className} aria-hidden="true" {...props} />;
  }

  if (id === 'tiktok') {
    return <SiTiktok className={className} aria-hidden="true" {...props} />;
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect width="18" height="18" x="3" y="3" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
