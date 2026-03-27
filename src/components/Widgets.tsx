import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "919656778508";
const RAZORPAY_URL = "https://razorpay.me/@adnan4402";

export function WhatsAppWidget() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I need technical support for Cornx.app")}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(142,70%,45%)] shadow-lg transition-transform hover:scale-110"
      aria-label="WhatsApp Support"
    >
      <MessageCircle className="h-6 w-6 text-[hsl(0,0%,100%)]" />
    </a>
  );
}

export function PaymentLink() {
  return (
    <a
      href={RAZORPAY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      💳 Make Payment
    </a>
  );
}
