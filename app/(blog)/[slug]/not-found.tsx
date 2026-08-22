import Link from "next/link";
import { Button } from "@/components/ui/button";
import { paths } from "@/lib/paths";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-semibold tracking-tight text-foreground mb-4">
        404
      </h1>

      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Este post não existe ou foi removido.
      </p>

      <Button variant="outline">
        <Link href={paths.home}>Voltar ao blog</Link>
      </Button>
    </div>
  );
}
