"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon, SlidersHorizontalIcon } from "lucide-react";

type ToolbarProps = {
  query: string;
  onQueryChange: (query: string) => void;
};

/**
 * Provides search and filtering controls for the blog listing.
 *
 * Search state is controlled by the parent interactive layer so this
 * component remains focused exclusively on rendering the toolbar UI.
 */
export function Toolbar({ query, onQueryChange }: ToolbarProps) {
  return (
    <div className="flex flex-row justify-between gap-2">
      <InputGroup className="bg-background">
        <InputGroupInput
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search for an article..."
          aria-label="Search articles"
        />

        <InputGroupAddon>
          <SearchIcon aria-hidden="true" />
        </InputGroupAddon>
      </InputGroup>

      <Drawer swipeDirection="right" modal={false}>
        <DrawerTrigger>
          <Button
            type="button"
            variant="ghost"
            className="text-muted-foreground"
          >
            <SlidersHorizontalIcon size={16} aria-hidden="true" />
            Filter
          </Button>
        </DrawerTrigger>

        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle className="font-normal">Filter Posts</DrawerTitle>
            </DrawerHeader>

            <div className="p-4">
              <p className="text-sm text-muted-foreground">
                Post filters will be available here.
              </p>
            </div>

            <DrawerFooter>
              <DrawerClose>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
