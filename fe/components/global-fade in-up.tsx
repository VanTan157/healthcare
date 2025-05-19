"use client";

export default function GlobalFadeInUpStyle() {
  return (
    <style jsx global>{`
      @keyframes fade-in-up {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fade-in-up {
        animation: fade-in-up 0.2s ease;
      }
    `}</style>
  );
}
