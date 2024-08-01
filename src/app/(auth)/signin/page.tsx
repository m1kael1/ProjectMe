import WelcomeLayout from "@/components/contents/landing/welcome-layout";
import dynamic from "next/dynamic";

const SigninSection = dynamic(() => import("@/components/auth/signin-section"), { ssr: false });

export default function SinginPage() {
  return (
    <WelcomeLayout>
      <SigninSection />
    </WelcomeLayout>
  );
}