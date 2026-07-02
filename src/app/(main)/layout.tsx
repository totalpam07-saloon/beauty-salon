import { SaaSNavbar } from "@/components/saas-navbar";

export default function SaaSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SaaSNavbar />
      {children}
    </>
  );
}
