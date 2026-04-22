#!/usr/bin/env python3
"""Generate simple PWA icons for IG Recruit"""
import struct, zlib, base64

def create_png(size, bg_color, text_color):
    """Create a minimal PNG with a simple design"""
    # Create pixel data - dark background with 'IR' initials
    pixels = []
    for y in range(size):
        row = []
        for x in range(size):
            # Background
            r, g, b, a = bg_color[0], bg_color[1], bg_color[2], 255
            # Blue accent circle
            cx, cy = size//2, size//2
            dist = ((x-cx)**2 + (y-cy)**2)**0.5
            if dist < size*0.42:
                r, g, b = 17, 24, 39  # dark card bg
            if dist < size*0.38 and dist > size*0.32:
                r, g, b = 37, 99, 235  # blue ring
            # Simple 'I' shape
            ix1, ix2 = int(size*0.42), int(size*0.52)
            iy1, iy2 = int(size*0.3), int(size*0.7)
            if ix1 <= x <= ix2 and iy1 <= y <= iy2:
                r, g, b = 241, 245, 249  # white text
            row.extend([r, g, b, a])
        pixels.append(row)
    
    # Build PNG
    def make_chunk(chunk_type, data):
        c = chunk_type + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)
    
    # IHDR
    ihdr_data = struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0)
    ihdr = make_chunk(b'IHDR', ihdr_data)
    
    # IDAT - raw pixel data
    raw = b''
    for row in pixels:
        raw += b'\x00' + bytes(row)
    compressed = zlib.compress(raw, 9)
    idat = make_chunk(b'IDAT', compressed)
    
    # IEND
    iend = make_chunk(b'IEND', b'')
    
    return b'\x89PNG\r\n\x1a\n' + ihdr + idat + iend

bg = (10, 15, 26)
for size, fname in [(192, 'public/icons/icon-192.png'), (512, 'public/icons/icon-512.png')]:
    png_data = create_png(size, bg, (241, 245, 249))
    with open(fname, 'wb') as f:
        f.write(png_data)
    print(f"Created {fname} ({size}x{size})")

print("Icons generated!")
