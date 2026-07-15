import { Editor } from "@tinymce/tinymce-react";

// Self-hosted TinyMCE (no API key needed)
import "tinymce/tinymce";
import "tinymce/models/dom";
import "tinymce/themes/silver";
import "tinymce/icons/default";

// Skin CSS (loaded into the page by Vite)
import "tinymce/skins/ui/oxide/skin.min.css";
// Content CSS (injected via content_style into the editor iframe)
import contentCss from "tinymce/skins/content/default/content.min.css?inline";
import contentUiCss from "tinymce/skins/ui/oxide/content.min.css?inline";

// Plugins
import "tinymce/plugins/advlist";
import "tinymce/plugins/autolink";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/charmap";
import "tinymce/plugins/preview";
import "tinymce/plugins/anchor";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/code";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import "tinymce/plugins/help";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/quickbars";

const customContentStyle = `
body{font-family:Inter,system-ui,sans-serif;font-size:15px;line-height:1.7;color:#0f172a;padding:1rem}
h1,h2,h3,h4{font-weight:700;color:#0b3b4a;margin:1em 0 .4em;line-height:1.25}
h1{font-size:2em} h2{font-size:1.5em} h3{font-size:1.25em}
a{color:#0891b2;text-decoration:underline}
blockquote{border-left:4px solid #0891b2;padding-left:1em;color:#475569;margin:1em 0;font-style:italic}
code{background:#f1f5f9;padding:.15em .35em;border-radius:.25em;font-family:ui-monospace,monospace}
pre{background:#0f172a;color:#e2e8f0;padding:1em;border-radius:.5em;overflow:auto}
img{max-width:100%;height:auto;border-radius:.5em}
ul,ol{padding-left:1.5em;margin:.75em 0}
table{border-collapse:collapse}
table td,table th{border:1px solid #cbd5e1;padding:.4em .6em}
`;

type Props = {
  value: string;
  onChange: (v: string) => void;
  direction?: "ltr" | "rtl";
  height?: number;
};

export function RichEditor({ value, onChange, direction = "ltr", height = 420 }: Props) {
  return (
    <Editor
      value={value}
      onEditorChange={(v) => onChange(v)}
      init={{
        height,
        menubar: "edit view insert format tools table",
        directionality: direction,
        skin: false,
        content_css: false,
        content_style: [contentCss, contentUiCss, customContentStyle].join("\n"),
        plugins: [
          "advlist","autolink","lists","link","image","charmap","preview","anchor",
          "searchreplace","visualblocks","code","fullscreen","insertdatetime","media",
          "table","help","wordcount","quickbars",
        ],
        toolbar:
          "undo redo | blocks | bold italic underline strikethrough | forecolor backcolor | " +
          "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | " +
          "link image media table | blockquote code | removeformat | fullscreen",
        block_formats:
          "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Blockquote=blockquote; Code=pre",
        quickbars_selection_toolbar: "bold italic | h2 h3 blockquote | link",
        quickbars_insert_toolbar: false,
        branding: false,
        promotion: false,
      }}
      licenseKey="gpl"
    />
  );
}
