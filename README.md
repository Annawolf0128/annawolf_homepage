Navigate to this homepage:
https://annawolf0128.github.io/

## Presentation slides

The first entry on `resources.html` opens the password gate in `slides.html`.
This is a simple visitor gate: the repository and slide files remain public.

To add slides, place the HTML or PDF file in this repository and add an entry to
`slides.json`, then commit and push both files:

```json
{
  "title": "Your presentation title",
  "file": "slides/your-presentation.pdf",
  "format": "PDF"
}
```

Titles open their files in a new browser tab, without forcing a download.
PDF viewing follows the visitor's browser settings. HTML presentations must
include any assets they reference. Do not put confidential files here.
