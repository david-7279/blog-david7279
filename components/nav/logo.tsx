import Link from "next/link";
import { paths } from "@/lib/paths";
import Text3DFlip from "@/components/ui/text-3d-flip";

const Logo = () => {
  return (
    <Link href={paths.home}>
      <Text3DFlip
        className="bg-transparent"
        textClassName="bg-transparent text-foreground text-xl sm:text-2xl font-semibold tracking-tight"
        flipTextClassName="bg-transparent text-foreground text-xl sm:text-2xl font-semibold tracking-tight"
        rotateDirection="top"
      >
        Blog
      </Text3DFlip>
    </Link>
  );
};
export default Logo;
