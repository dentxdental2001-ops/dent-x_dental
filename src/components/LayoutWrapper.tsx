"use client";

import { usePathname } from 'next/navigation';
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  
  // Check if current path is an admin page
  const isAdminPage = pathname?.startsWith('/admin');
  
  if (isAdminPage) {
    // Admin pages - no header/footer/whatsapp
    return <>{children}</>;
  }
  
  // Regular pages - include header/footer/whatsapp
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}