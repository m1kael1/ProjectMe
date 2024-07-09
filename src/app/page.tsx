import WelcomeLayout from "@/components/contents/landing/welcome-layout";
import { WelcomeSection } from "@/components/contents/landing/welcome-section";
import { Boxes } from "@/components/ui/background-boxes";

export default function Index() {
  return (
    <WelcomeLayout>
      {/* <Boxes className="opacity-30" /> */}
      <WelcomeSection />
    </WelcomeLayout>
  );
}
