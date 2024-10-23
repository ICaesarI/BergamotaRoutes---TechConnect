import { RegisterProvider } from "@techconnect /src/components/context/registerContext";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RegisterProvider>
      <div className="register-layout">{children}</div>
    </RegisterProvider>
  );
}
