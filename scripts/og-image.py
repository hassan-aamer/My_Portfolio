#!/usr/bin/env python3
"""
Generates images/og-cover.png — the 1200x630 social preview card used by
LinkedIn, WhatsApp, X/Twitter, Slack, etc. Requires Pillow (pip install pillow).

Usage: python3 scripts/og-image.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
W, H = 1200, 630

BG = (5, 7, 12)
CYAN = (34, 211, 238)
EMERALD = (16, 185, 129)
TEXT = (248, 250, 252)
BODY = (203, 213, 225)
MUTED = (148, 163, 184)
BORDER = (30, 41, 59)

DISPLAY = ROOT / "fonts/Yq6W-LOTXCb04q32xlpwu8Zf.woff2"  # Unbounded (variable)
SANS = ROOT / "fonts/pxiEyp8kv8JHgFVrJJfecg.woff2"  # Poppins 400
MONO = ROOT / "fonts/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPxDcwg.woff2"  # JetBrains Mono


def font(path, size, weight=None):
    f = ImageFont.truetype(str(path), size)
    if weight is not None:
        try:
            f.set_variation_by_axes([weight])
        except (OSError, AttributeError):
            pass
    return f


def main():
    img = Image.new("RGB", (W, H), BG)

    # Soft ambient glows
    glow = Image.new("RGB", (W, H), BG)
    g = ImageDraw.Draw(glow)
    g.ellipse((-200, -260, 620, 420), fill=(8, 52, 66))
    g.ellipse((760, 260, 1480, 900), fill=(6, 46, 38))
    img = Image.blend(img, glow.filter(ImageFilter.GaussianBlur(140)), 0.9)
    d = ImageDraw.Draw(img)

    # Perspective-ish grid
    for x in range(0, W, 60):
        d.line([(x, 0), (x, H)], fill=(12, 18, 30))
    for y in range(0, H, 60):
        d.line([(0, y), (W, y)], fill=(12, 18, 30))

    # Portrait in a ringed circle
    size = 270
    cx, cy = 960, 300
    portrait = Image.open(ROOT / "images/h.webp").convert("RGB")
    side = min(portrait.size)
    portrait = portrait.crop(
        ((portrait.width - side) // 2, (portrait.height - side) // 2,
         (portrait.width + side) // 2, (portrait.height + side) // 2)
    ).resize((size, size), Image.LANCZOS)
    mask = Image.new("L", (size * 4, size * 4), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size * 4, size * 4), fill=255)
    mask = mask.resize((size, size), Image.LANCZOS)
    for r, col, w in ((size // 2 + 28, BORDER, 2), (size // 2 + 12, CYAN, 3)):
        d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=col, width=w)
    img.paste(portrait, (cx - size // 2, cy - size // 2), mask)

    # Copy
    left = 80
    d.rounded_rectangle((left, 92, left + 300, 128), radius=18, outline=BORDER, width=2, fill=(9, 14, 26))
    d.ellipse((left + 16, 104, left + 28, 116), fill=EMERALD)
    d.text((left + 40, 110), "CAIRO, EGYPT  •  REMOTE", font=font(MONO, 17), fill=BODY, anchor="lm")

    d.text((left, 168), "Hassan Mohamed", font=font(DISPLAY, 58, 700), fill=TEXT)
    d.text((left, 252), "Backend Software Engineer", font=font(SANS, 38), fill=CYAN)
    d.text((left, 316), "Java / Spring Boot  •  PHP / Laravel", font=font(SANS, 27), fill=BODY)

    d.line([(left, 380), (left + 120, 380)], fill=CYAN, width=3)
    tags = ["Microservices", "Multi-Tenant SaaS", "Event-Driven APIs"]
    tf = font(MONO, 20)
    x = left
    for t in tags:
        tw = d.textlength(t, font=tf)
        d.rounded_rectangle((x, 410, x + tw + 32, 452), radius=10, outline=BORDER, width=2, fill=(11, 17, 30))
        d.text((x + 16, 431), t, font=tf, fill=TEXT, anchor="lm")
        x += tw + 46

    d.text((left, 540), "hassan-aamer.github.io/My_Portfolio", font=font(MONO, 20), fill=MUTED)
    d.text((left, 570), "5 years in production", font=font(MONO, 20), fill=MUTED)

    out = ROOT / "images/og-cover.png"
    img.save(out, "PNG", optimize=True)
    print(f"Wrote {out.relative_to(ROOT)} ({out.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
