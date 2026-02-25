import BackToTop from "@/react-app/components/BackToTop";
import WhatsAppButton from "@/react-app/components/WhatsAppButton";

/**
 * Groups floating action buttons (Back to top, WhatsApp) in one column
 * so they never overlap and stay predictable for UI/UX.
 */
export default function FloatingActions() {
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end"
      aria-label="Floating actions"
    >
      <BackToTop />
      <WhatsAppButton />
    </div>
  );
}
