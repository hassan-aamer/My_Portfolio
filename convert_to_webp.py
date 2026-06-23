import os
from PIL import Image

def convert_to_webp(input_path, output_path, is_animated=False):
    try:
        img = Image.open(input_path)
        if is_animated and hasattr(img, 'is_animated') and img.is_animated:
            # For animated GIFs, extract all frames and save as animated WebP
            frames = []
            durations = []
            for frame_idx in range(img.n_frames):
                img.seek(frame_idx)
                frames.append(img.copy())
                durations.append(img.info.get('duration', 100))
            
            frames[0].save(
                output_path,
                format='WEBP',
                save_all=True,
                append_images=frames[1:],
                duration=durations,
                loop=img.info.get('loop', 0),
                quality=80
            )
        else:
            # For static images (JPEG, PNG)
            img.save(output_path, format='WEBP', quality=80)
        print(f"Successfully converted {input_path} to {output_path}")
    except Exception as e:
        print(f"Error converting {input_path}: {str(e)}")

def main():
    base_dir = "images"
    
    # 1. Convert h.jpg
    h_jpg = os.path.join(base_dir, "h.jpg")
    if os.path.exists(h_jpg):
        convert_to_webp(h_jpg, os.path.join(base_dir, "h.webp"))
        
    # 2. Convert logo.png
    logo_png = os.path.join(base_dir, "logo.png")
    if os.path.exists(logo_png):
        convert_to_webp(logo_png, os.path.join(base_dir, "logo.webp"))
        
    # 3. Convert web.gif (animated)
    web_gif = os.path.join(base_dir, "web.gif")
    if os.path.exists(web_gif):
        convert_to_webp(web_gif, os.path.join(base_dir, "web.webp"), is_animated=True)

if __name__ == "__main__":
    main()
