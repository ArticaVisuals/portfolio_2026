from pathlib import Path
import re
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Preformatted, PageBreak
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader

WORKSPACE = Path(__file__).resolve().parents[2]
FONT_DIR = Path('/Users/micahhoang/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/libreoffice-headless/libreoffice/LibreOfficeDev.app/Contents/Resources/fonts/truetype')
for name, filename in [('PrepSans', 'DejaVuSans.ttf'), ('PrepSans-Bold', 'DejaVuSans-Bold.ttf'), ('PrepMono', 'DejaVuSansMono.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(FONT_DIR / filename)))
pdfmetrics.registerFontFamily('PrepSans', normal='PrepSans', bold='PrepSans-Bold', italic='PrepSans', boldItalic='PrepSans-Bold')

styles = {
    'body': ParagraphStyle('body', fontName='PrepSans', fontSize=10.2, leading=14.3, textColor=colors.HexColor('#252525'), spaceAfter=9),
    'bullet': ParagraphStyle('bullet', fontName='PrepSans', fontSize=10.2, leading=14.3, textColor=colors.HexColor('#252525'), leftIndent=13, firstLineIndent=-10, spaceAfter=7),
    'heading': ParagraphStyle('heading', fontName='PrepSans-Bold', fontSize=13, leading=17, spaceBefore=9, spaceAfter=9, keepWithNext=True),
    'title': ParagraphStyle('title', fontName='PrepSans-Bold', fontSize=23, leading=28, spaceAfter=5),
    'subtitle': ParagraphStyle('subtitle', fontName='PrepSans', fontSize=12, leading=17, textColor=colors.HexColor('#666666'), spaceAfter=19),
    'code': ParagraphStyle('code', fontName='PrepMono', fontSize=8.8, leading=11.3, spaceBefore=6, spaceAfter=13),
}


def fmt(text):
    text = escape(text.replace('\u2011', '-').replace('\u2013', '-').replace('\u2014', ', '))
    text = re.sub(r'\[([^\]]+)\]\((https?://[^\)]+)\)', lambda m: '<link href="' + m.group(2) + '" color="#234F78"><u>' + m.group(1) + '</u></link>', text)
    text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
    return re.sub(r'`([^`]+)`', r'<font name="PrepMono" size="9">\1</font>', text)


source = (WORKSPACE / 'output/grad-icp-workshop-authoring/STUDENT-PREP-EMAIL.md').read_text()
story = [Paragraph('Before our ICP workshop', styles['title']), Paragraph('Setup + materials to bring', styles['subtitle'])]
for block in source.split('\n\n')[1:]:
    if block.startswith('```text'):
        story.append(Preformatted(block.removeprefix('```text\n').removesuffix('\n```'), styles['code']))
    elif block.startswith('Here’s what belongs'):
        story.extend([PageBreak(), Paragraph('What to include', styles['heading'])])
    elif block.startswith('**') and block.endswith('**') and re.match(r'\*\*[123]\.', block):
        story.append(Paragraph(fmt(block), styles['heading']))
    elif block.startswith('- '):
        for line in block.split('\n'):
            if line.startswith('- '):
                story.append(Paragraph('- ' + fmt(line[2:]), styles['bullet']))
    else:
        story.append(Paragraph(fmt(block).replace('\n', '<br/>'), styles['body']))


def footer(canvas, document):
    canvas.setStrokeColor(colors.HexColor('#DDDDDD'))
    canvas.setLineWidth(.5)
    canvas.line(48, 40, 564, 40)
    canvas.setFont('PrepSans', 8)
    canvas.setFillColor(colors.HexColor('#777777'))
    canvas.drawString(48, 27, 'ICP workshop | Student preparation')
    canvas.drawRightString(564, 27, str(document.page))


output = WORKSPACE / 'output/pdf/ICP-Workshop-Student-Prep.pdf'
output.parent.mkdir(exist_ok=True)
doc = SimpleDocTemplate(str(output), pagesize=(612, 792), rightMargin=48, leftMargin=48, topMargin=42, bottomMargin=54,
                        title='Before our ICP workshop: setup + materials to bring', author='Micah Hoang')
doc.build(story, onFirstPage=footer, onLaterPages=footer)
reader = PdfReader(output)
assert len(reader.pages) == 2, f'Unexpected page count: {len(reader.pages)}'
print(f'Created {output} ({len(reader.pages)} pages)')
