import WelcomeLayout from "@/components/contents/landing/welcome-layout";
import { Boxes } from "@/components/ui/background-boxes";
import dynamic from "next/dynamic";

const SigninSection = dynamic(() => import("@/components/auth/signin-section"), { ssr: false });

export default function SinginPage() {
  return (
    <WelcomeLayout>
      <Boxes className="opacity-30" />
      <SigninSection />
    </WelcomeLayout>
  );
}