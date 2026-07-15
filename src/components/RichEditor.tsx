import { Editor } from "@tinymce/tinymce-react";

// Self-hosted TinyMCE (no API key needed)
import "tinymce/tinymce";
import "tinymce/models/dom";
import "tinymce/themes/silver";
import "tinymce/icons/default";
import "tinymce/skins/ui/oxide/skin.js";

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

type Props = {
  value: string;
  onChange: (v: string) => void;
  direction?: "ltr" | "rtl";
  height?: number;
};

export function RichEditor({ value, onChange, direction = "ltr", height = 400 }: Props) {
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
        content_style:
          "body{font-family:Inter,system-ui,sans-serif;font-size:15px;line-height:1.7;color:#0f172a} h1,h2,h3,h4{font-weight:700;color:#0b3b4a;margin:1em 0 .4em} h1{font-size:2em} h2{font-size:1.5em} h3{font-size:1.25em} a{color:#0891b2;text-decoration:underline} blockquote{border-left:4px solid #0891b2;padding-left:1em;color:#475569;margin:1em 0} code{background:#f1f5f9;padding:.15em .35em;border-radius:.25em}",
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
    />
  );
}
