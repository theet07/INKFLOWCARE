import os
from PIL import Image

def generate_adaptive_icon():
    input_path = "c:\\Users\\DMJ\\OneDrive\\Documentos\\INKFLOWCARE\\assets\\images\\FAVORICON-INKFLOW-WHITE.png"
    output_path = "c:\\Users\\DMJ\\OneDrive\\Documentos\\INKFLOWCARE\\assets\\images\\adaptive-icon.png"
    
    if not os.path.exists(input_path):
        print(f"File not found: {input_path}")
        return

    # Open original image
    img = Image.open(input_path).convert("RGBA")
    
    # Calculate new size (60% of 1024) -> ~614x614
    canvas_size = 1024
    scale_factor = 0.6
    
    # Determine the aspect ratio of the original image
    aspect = img.width / img.height
    
    # Let's target a box of 614x614
    target_box_size = int(canvas_size * scale_factor)
    
    if img.width > img.height:
        new_w = target_box_size
        new_h = int(target_box_size / aspect)
    else:
        new_h = target_box_size
        new_w = int(target_box_size * aspect)
        
    # Resize the image using Lanczos
    resized_img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Create a blank transparent canvas 1024x1024
    canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    
    # Paste the resized image into the center of the canvas
    offset_x = (canvas_size - new_w) // 2
    offset_y = (canvas_size - new_h) // 2
    
    canvas.paste(resized_img, (offset_x, offset_y), resized_img)
    
    # Save the result
    canvas.save(output_path, "PNG")
    print(f"Successfully created adaptive icon at {output_path}")

if __name__ == "__main__":
    generate_adaptive_icon()
