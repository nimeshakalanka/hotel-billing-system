import sys
import json
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

def generate_pdf(data, output_path):
    c = canvas.Canvas(output_path, pagesize=A4)
    width, height = A4

    # Header logo
    try:
        logo = ImageReader("python_pdf/logo.png")
        c.drawImage(logo, 50, height - 80, width=80, preserveAspectRatio=True)
    except Exception as e:
        print("Logo missing:", e)

    # Header text
    c.setFont("Helvetica-Bold", 16)
    c.drawString(200, height - 50, "Hotel Dream Palace")

    # Line
    c.line(50, height - 90, width - 50, height - 90)

    c.setFont("Helvetica", 12)
    c.drawString(50, height - 120, f"Bill Type: {data.get('type', '')}")
    c.drawString(50, height - 140, f"Customer: {data.get('customerName', 'Guest')}")
    c.drawString(50, height - 160, f"Date: {data.get('date', '')}")

    y = height - 200
    c.setFont("Helvetica-Bold", 13)
    c.drawString(50, y, "Details:")
    y -= 20
    c.setFont("Helvetica", 12)

    for key, value in data.get("details", {}).items():
        c.drawString(60, y, f"{key}: {value}")
        y -= 20

    c.drawString(50, y - 10, f"Total: Rs. {data.get('total', 0)}")

    # Footer
    c.setFont("Helvetica-Oblique", 10)
    c.drawString(50, 30, "Thank you for your stay!")
    c.drawString(width - 200, 30, "Hotel Dream Palace © 2025")

    c.showPage()
    c.save()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("❌ Usage: python generate_pdf.py '<json>' '<output_path>'")
        sys.exit(1)
    data = json.loads(sys.argv[1])
    output_path = sys.argv[2]
    generate_pdf(data, output_path)
    print("✅ PDF generated at:", output_path)
