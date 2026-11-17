export default function Icon({ name, size = 18 }) {
  const paths = {
    upload: (
      <>
        <path d="M12 16V4" />
        <path d="m7 9 5-5 5 5" />
        <path d="M5 15v4h14v-4" />
      </>
    ),
    camera: (
      <>
        <path d="M4 7h3l1.5-2h7L17 7h3v12H4z" />
        <circle cx="12" cy="13" r="3.5" />
      </>
    ),
    download: (
      <>
        <path d="M12 4v12" />
        <path d="m7 11 5 5 5-5" />
        <path d="M5 20h14" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    photo: (
      <>
        <rect x="3.5" y="4.5" width="17" height="15" rx="1" />
        <circle cx="9" cy="10" r="1.5" />
        <path d="m5 17 5-5 3 3 2-2 4 4" />
      </>
    ),
    polaroid: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="1" />
        <rect x="6.5" y="5.5" width="11" height="10" />
        <path d="M8 18h8" />
      </>
    ),
    strip: (
      <>
        <rect x="6" y="3" width="12" height="18" rx="1" />
        <path d="M8.5 5.5h7v3h-7zm0 5h7v3h-7zm0 5h7v3h-7z" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        <path d="M12 14v3" />
      </>
    ),
  };
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
