import { SigninSection } from "@/components/auth/signin-section";
import WelcomeLayout from "@/components/contents/landing/welcome-layout";

export default function SinginPage() {
  return (
    <WelcomeLayout>
      <SigninSection />
    </WelcomeLayout>
  );
}