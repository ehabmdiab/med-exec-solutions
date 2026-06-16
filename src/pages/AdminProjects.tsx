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
import { Trash2, LogOut, Pencil, X } from "lucide-react";

type Project = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  location_en: string;
  location_ar: string;
  sector_en: string;
  sector_ar: string;
  problem_en: string;
  problem_ar: string;
  solution_en: string;
  solution_ar: string;
  outcome_en: string;
  outcome_ar: string;
  image_url: string | null;
  sort_order: number;
  published: boolean;
};

const emptyForm = {
  slug: "",
  name_en: "",
  name_ar: "",
  location_en: "",
  location_ar: "",
  sector_en: "",
  sector_ar: "",
  problem_en: "",
  problem_ar: "",
  solution_en: "",
  solution_ar: "",
  outcome_en: "",
  outcome_ar: "",
  sort_order: 0,
  published: true,
};

export default function AdminProjects() {
  useSEO({ title: "Admin · Projects — AUH", description: "Manage projects" });
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [items, setItems] = useState<Project[]>([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);

  // Auth + role
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
      const { data: roles } = await supabase
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

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (!error && data) setItems(data as Project[]);
  };

  useEffect(() => {
    if (isAdmin) loadProjects();
  }, [isAdmin]);

  const claimAdmin = async () => {
    const { data, error } = await supabase.rpc("claim_first_admin");
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    if (data) {
      toast({ title: "You are now admin" });
      setIsAdmin(true);
    } else {
      toast({ title: "Admin already exists", description: "Ask an existing admin to grant you access.", variant: "destructive" });
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("project-images").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("project-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let image_url: string | null = null;
      if (imageFile) image_url = await uploadImage(imageFile);

      const payload: any = { ...form };
      if (image_url) payload.image_url = image_url;

      if (editingId) {
        const { error } = await supabase.from("projects").update(payload).eq("id", editingId);
        if (error) throw error;
        toast({ title: "Project updated" });
      } else {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
        toast({ title: "Project added" });
      }
      setForm({ ...emptyForm });
      setImageFile(null);
      setEditingId(null);
      setExistingImage(null);
      const inp = document.getElementById("img-input") as HTMLInputElement | null;
      if (inp) inp.value = "";
      loadProjects();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    loadProjects();
  };

  const startEdit = (p: Project) => {
    setEditingId(p.id);
    setExistingImage(p.image_url);
    setImageFile(null);
    setForm({
      slug: p.slug,
      name_en: p.name_en, name_ar: p.name_ar,
      location_en: p.location_en, location_ar: p.location_ar,
      sector_en: p.sector_en, sector_ar: p.sector_ar,
      problem_en: p.problem_en, problem_ar: p.problem_ar,
      solution_en: p.solution_en, solution_ar: p.solution_ar,
      outcome_en: p.outcome_en, outcome_ar: p.outcome_ar,
      sort_order: p.sort_order,
      published: p.published,
    });
    const inp = document.getElementById("img-input") as HTMLInputElement | null;
    if (inp) inp.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setExistingImage(null);
    setImageFile(null);
    setForm({ ...emptyForm });
    const inp = document.getElementById("img-input") as HTMLInputElement | null;
    if (inp) inp.value = "";
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
              If no admin exists yet, you can claim the first admin role for your account.
            </p>
            <div className="flex gap-3">
              <Button onClick={claimAdmin}>Claim admin</Button>
              <Button variant="outline" onClick={signOut}><LogOut className="h-4 w-4 me-2"/>Sign out</Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  const field = (key: keyof typeof emptyForm, label: string, textarea = false) => (
    <div key={key as string}>
      <Label htmlFor={key as string}>{label}</Label>
      {textarea ? (
        <Textarea
          id={key as string}
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
              <h1 className="font-display font-bold text-3xl text-primary">Manage Projects</h1>
              <p className="text-sm text-muted-foreground">Signed in as {user?.email}</p>
            </div>
            <Button variant="outline" onClick={signOut}><LogOut className="h-4 w-4 me-2"/>Sign out</Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <form onSubmit={onSubmit} className="bg-card rounded-2xl border border-border p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-semibold text-xl text-primary">
                  {editingId ? "Edit project" : "Add new project"}
                </h2>
                {editingId && (
                  <Button type="button" variant="ghost" size="sm" onClick={cancelEdit}>
                    <X className="h-4 w-4 me-1" /> Cancel
                  </Button>
                )}
              </div>
              {field("slug", "Slug (unique, e.g. dental-art)")}
              <div className="grid grid-cols-2 gap-3">
                {field("name_en", "Name (EN)")}
                {field("name_ar", "Name (AR)")}
                {field("location_en", "Location (EN)")}
                {field("location_ar", "Location (AR)")}
                {field("sector_en", "Sector (EN)")}
                {field("sector_ar", "Sector (AR)")}
              </div>
              {field("problem_en", "Problem (EN)", true)}
              {field("problem_ar", "Problem (AR)", true)}
              {field("solution_en", "Solution (EN)", true)}
              {field("solution_ar", "Solution (AR)", true)}
              {field("outcome_en", "Outcome (EN)", true)}
              {field("outcome_ar", "Outcome (AR)", true)}
              <div>
                <Label htmlFor="img-input">Image {editingId && "(leave empty to keep current)"}</Label>
                {editingId && existingImage && !imageFile && (
                  <img src={existingImage} alt="current" className="h-20 w-20 object-cover rounded-md my-2" />
                )}
                <Input
                  id="img-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                />
              </div>
              <div>
                <Label htmlFor="sort">Sort order</Label>
                <Input
                  id="sort"
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value || "0", 10) })}
                />
              </div>
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? "Saving..." : editingId ? "Save changes" : "Add project"}
              </Button>
            </form>

            <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
              <h2 className="font-display font-semibold text-xl text-primary mb-4">
                Existing projects ({items.length})
              </h2>
              <div className="space-y-3">
                {items.length === 0 && <p className="text-sm text-muted-foreground">No projects yet.</p>}
                {items.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 border border-border rounded-lg p-3">
                    {p.image_url && (
                      <img src={p.image_url} alt={p.name_en} className="h-14 w-14 object-cover rounded-md" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-primary truncate">{p.name_en}</p>
                      <p className="text-xs text-muted-foreground truncate">{p.slug} · {p.location_en}</p>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => startEdit(p)} title="Edit">
                      <Pencil className="h-4 w-4 text-primary" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => deleteProject(p.id)} title="Delete">
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
