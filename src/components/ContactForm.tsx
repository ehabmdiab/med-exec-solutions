import { useState } from "react";
import { z } from "zod";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/i18n/I18nProvider";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  company: z.string().trim().max(150).optional().or(z.literal("")),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  project_type: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(1).max(2000),
});

type FormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  project_type: string;
  message: string;
};

const initial: FormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  country: "",
  project_type: "",
  message: "",
};

export function ContactForm() {
  const { t, locale } = useI18n();
  const { toast } = useToast();
  const [values, setValues] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: string) =>
    setValues((s) => ({ ...s, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FormState;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "77be38bf-ed2f-4f06-9584-19cff3a891e3";
      
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: values.name,
          email: values.email,
          company: values.company || "N/A",
          phone: values.phone || "N/A",
          country: values.country || "N/A",
          project_type: values.project_type || "N/A",
          message: values.message,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: t.contact.form.success });
        setValues(initial);
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (error) {
      console.error("Failed to send email via Web3Forms:", error);
      toast({
        title: "Submission Error",
        description: "Failed to send the email. Please check your network connection.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label={t.contact.form.name} error={errors.name} required>
          <Input
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            maxLength={100}
            autoComplete="name"
          />
        </Field>
        <Field label={t.contact.form.company} error={errors.company}>
          <Input
            value={values.company}
            onChange={(e) => set("company", e.target.value)}
            maxLength={150}
            autoComplete="organization"
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label={t.contact.form.email} error={errors.email} required>
          <Input
            type="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            maxLength={255}
            autoComplete="email"
          />
        </Field>
        <Field label={t.contact.form.phone} error={errors.phone}>
          <Input
            type="tel"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            maxLength={40}
            autoComplete="tel"
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label={t.contact.form.country} error={errors.country}>
          <Input
            value={values.country}
            onChange={(e) => set("country", e.target.value)}
            maxLength={80}
            autoComplete="country-name"
          />
        </Field>
        <Field label={t.contact.form.projectType} error={errors.project_type}>
          <Select
            value={values.project_type}
            onValueChange={(v) => set("project_type", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="—" />
            </SelectTrigger>
            <SelectContent>
              {t.contact.form.projectTypes.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label={t.contact.form.message} error={errors.message} required>
        <Textarea
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          maxLength={2000}
          rows={5}
        />
      </Field>

      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="bg-primary text-primary-foreground hover:opacity-95 hover-lift shadow-soft font-semibold w-full sm:w-auto"
      >
        {submitting ? (
          <>
            <Loader2 className="me-2 h-4 w-4 animate-spin" />
            {t.contact.form.submitting}
          </>
        ) : (
          <>
            <Send className="me-2 h-4 w-4" />
            {t.contact.form.submit}
          </>
        )}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
