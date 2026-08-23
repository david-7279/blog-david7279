import {
  ExpandableScreen,
  ExpandableScreenContent,
  ExpandableScreenTrigger,
} from "@/components/ui/expandable-screen";
import { paths } from "@/lib/paths";
import { RollingTextButton } from "@/components/ui/rolling-text-button";
import * as React from "react";
import Link from "next/link";
import Text3DFlip from "@/components/ui/text-3d-flip";
import ExpandableContent from "@/components/footer/expandable-content";

const Footer = () => {
  return (
    <div className="flex flex-row flex-wrap justify-between items-center gap-2">
      <div>
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
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          Just my thoughts and ideas about programming
        </p>
      </div>

      <div className="flex flex-row flex-wrap gap-2">
        <RollingTextButton
          title="Github"
          href={"https://github.com/david-7279"}
          className="bg-background! text-foreground!"
        />

        <ExpandableScreen
          layoutId="cta-card"
          triggerRadius="100px"
          contentRadius="24px"
        >
          <div className="flex items-center justify-center">
            <ExpandableScreenTrigger>
              <RollingTextButton
                href={"#"}
                title="Contact me"
                className="bg-background! text-foreground!"
              />
            </ExpandableScreenTrigger>
          </div>

          <ExpandableScreenContent className="bg-primary">
            <ExpandableContent />
          </ExpandableScreenContent>
        </ExpandableScreen>
      </div>
    </div>
  );
};
export default Footer;
