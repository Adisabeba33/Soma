import { LoungePage } from "@/components/account/lounge-page";
import { TasteBlenderBlock } from "@/components/taste-blender-block";

export const metadata = { title: "Taste blender — SŌMA" };

export default function AccountBlenderPage() {
  return (
    <LoungePage
      eyebrow="Taste blender"
      title="Craft the perfect blend"
      intro="Merge two profiles and dial how the pair leans; merge a third and dose how much of it joins the pour."
    >
      <TasteBlenderBlock />
    </LoungePage>
  );
}
