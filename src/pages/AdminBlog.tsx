import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/useSEO";
import { Trash2, LogOut } from "lucide-react";
import type { BlogPost } from "@/hooks/useBlogPosts";

const emptyForm = {
  slug: "",
  title_en: "",
  title_ar: "",
  excerpt_en: "",
  excerpt_ar: "",
  content_en: "",
  content_ar: "",
  author: "",
  tags: "",
  published: true,
};

export default function AdminBlog() {
  useSEO({ title: "Admin · Blog — AUH", description: "Manage blog posts", noIndex: true });
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [items, setItems] = useState<BlogPost[]>([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(async ({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      if (!u) {
        navigate("/auth");
        return;
      }
      const { data: roles } = await (supabase as any)
        .from("user_roles")
        .select("role")
        .eq("user_id", u.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!roles);
      setChecking(false);
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const load = async () => {
    const { data } = await (supabase as any)
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });
    if (data) setItems(data as BlogPost[]);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, file);
    if (error) throw error;
    // Store the storage path; signed URLs are generated on read.
    return path;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let cover_image_url: string | null = null;
      if (imageFile) cover_image_url = await uploadImage(imageFile);

      const tags = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload: any = {
        slug: form.slug,
        title_en: form.title_en,
        title_ar: form.title_ar,
        excerpt_en: form.excerpt_en,
        excerpt_ar: form.excerpt_ar,
        content_en: form.content_en,
        content_ar: form.content_ar,
        author: form.author,
        tags,
        published: form.published,
      };
      if (cover_image_url) payload.cover_image_url = cover_image_url;

      const { error } = await (supabase as any).from("blog_posts").insert(payload);
      if (error) throw error;
      toast({ title: "Post published" });
      setForm({ ...emptyForm });
      setImageFile(null);
      const input = document.getElementById("blog-img-input") as HTMLInputElement | null;
      if (input) input.value = "";
      load();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await (supabase as any).from("blog_posts").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    load();
  };

  const togglePublished = async (p: BlogPost) => {
    const { error } = await (supabase as any)
      .from("blog_posts")
      .update({ published: !p.published })
      .eq("id", p.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    load();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (checking) {
    return (
      <Layout>
        <div className="pt-32 pb-20 container-wide">Loading...</div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <section className="pt-32 pb-20 container-wide max-w-md">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-soft">
            <h1 className="font-display font-bold text-2xl text-primary mb-3">No admin access</h1>
            <p className="text-muted-foreground mb-6 text-sm">
              You need an admin role to manage the blog.
            </p>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4 me-2" />
              Sign out
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  const field = (
    key: keyof typeof emptyForm,
    label: string,
    textarea = false,
    rows = 3,
  ) => (
    <div key={key as string}>
      <Label htmlFor={key as string}>{label}</Label>
      {textarea ? (
        <Textarea
          id={key as string}
          rows={rows}
          value={(form as any)[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      ) : (
        <Input
          id={key as string}
          value={(form as any)[key] as string}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      )}
    </div>
  );

  return (
    <Layout>
      <section className="pt-32 pb-20 bg-gradient-soft">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display font-bold text-3xl text-primary">Manage Blog</h1>
              <p className="text-sm text-muted-foreground">Signed in as {user?.email}</p>
            </div>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4 me-2" />
              Sign out
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <form
              onSubmit={onSubmit}
              className="bg-card rounded-2xl border border-border p-6 shadow-soft space-y-4"
            >
              <h2 className="font-display font-semibold text-xl text-primary">New post</h2>
              {field("slug", "Slug (unique, e.g. cleanroom-iso-7)")}
              <div className="grid grid-cols-2 gap-3">
                {field("title_en", "Title (EN)")}
                {field("title_ar", "Title (AR)")}
              </div>
              {field("excerpt_en", "Excerpt (EN)", true, 2)}
              {field("excerpt_ar", "Excerpt (AR)", true, 2)}
              {field("content_en", "Content (EN)", true, 10)}
              {field("content_ar", "Content (AR)", true, 10)}
              <div className="grid grid-cols-2 gap-3">
                {field("author", "Author")}
                {field("tags", "Tags (comma separated)")}
              </div>
              <div>
                <Label htmlFor="blog-img-input">Cover image</Label>
                <Input
                  id="blog-img-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                />
                Published
              </label>
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? "Saving..." : "Publish post"}
              </Button>
            </form>

            <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
              <h2 className="font-display font-semibold text-xl text-primary mb-4">
                Posts ({items.length})
              </h2>
              <div className="space-y-3">
                {items.length === 0 && (
                  <p className="text-sm text-muted-foreground">No posts yet.</p>
                )}
                {items.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 border border-border rounded-lg p-3"
                  >
                    {p.cover_image_url && (
                      <img
                        src={p.cover_image_url}
                        alt={p.title_en}
                        className="h-14 w-14 object-cover rounded-md"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-primary truncate">{p.title_en}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        /{p.slug} · {p.published ? "Published" : "Draft"}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => togglePublished(p)}>
                      {p.published ? "Unpublish" : "Publish"}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => deletePost(p.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
