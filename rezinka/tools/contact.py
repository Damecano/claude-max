"""Contact sheet of rendered slides: output/_contact.jpg (1/4 size) and
output/_thumbs.jpg (~ phone search-grid size) to judge legibility at a glance.
Usage: python tools/contact.py [outDir=output]"""
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
out = (ROOT / (sys.argv[1] if len(sys.argv) > 1 else 'output')).resolve()
pngs = sorted(p for p in out.glob('[0-9][0-9]_*.png'))
if not pngs:
    sys.exit(f'no slides in {out}')
for name, w, gap in (('_contact.jpg', 270, 16), ('_thumbs.jpg', 170, 10)):
    h = w * 4 // 3
    cols = min(4, len(pngs))
    rows = (len(pngs) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * w + (cols + 1) * gap, rows * h + (rows + 1) * gap), (232, 232, 232))
    for i, p in enumerate(pngs):
        im = Image.open(p).convert('RGB').resize((w, h), Image.LANCZOS)
        sheet.paste(im, (gap + (i % cols) * (w + gap), gap + (i // cols) * (h + gap)))
    sheet.save(out / name, quality=90)
    print(out / name)
