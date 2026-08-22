import { getAllPosts, getPostBySlug } from "@/lib/posts";

export default function TestPage() {
  const posts = getAllPosts();
  const post = getPostBySlug("ola-mundo");

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Teste de Posts</h1>

      <div>
        <h2 className="font-semibold">Todos os posts:</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(posts, null, 2)}
        </pre>
      </div>

      <div>
        <h2 className="font-semibold">Post "ola-mundo":</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(post, null, 2)}
        </pre>
      </div>
    </div>
  );
}
