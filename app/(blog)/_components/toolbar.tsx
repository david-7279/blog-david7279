import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { SearchIcon, SlidersHorizontalIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const Toolbar = () => {
  return (
    <div className="flex flex-row justify-between gap-2">
      <InputGroup className="bg-background">
        <InputGroupInput placeholder="Search for a article..." />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>

      <Drawer swipeDirection="right" modal={false}>
        <DrawerTrigger>
          <Button variant="ghost" className="text-muted-foreground">
            <SlidersHorizontalIcon size={16} />
            Filter
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle className="font-normal">
                Please login again.
              </DrawerTitle>
            </DrawerHeader>
            <p className="text-muted-foreground p-4">
              Your session has expired. Please login again to continue using the
              application.
            </p>
            <DrawerFooter>
              <Button type="submit">Login</Button>
              <DrawerClose>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
export default Toolbar;
