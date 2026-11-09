from pathlib import Path
from html import escape
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

OUT=Path(__file__).parent
ROOT=Path.cwd()
fonts={
 'sans':TTFont('/Users/micahhoang/Library/Fonts/GT-Standard-L-Standard-Regular-Trial.otf'),
 'mono':TTFont('/Users/micahhoang/Library/Fonts/GT-Standard-Mono-Standard-Regular-Trial.otf')}
fallback=TTFont('/Library/Fonts/Inter-Regular.ttf')
parts=['<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><title>Micah Hoang — Color palette</title><desc>Primary colors #2C402D, #F7F5F0, #141414. Website neutrals #141414, #525252, #848484. Green tints are derived by mixing forest green with cream.</desc>']
def rect(x,y,w,h,color,stroke=None):
 parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{color}"'+(f' stroke="{stroke}" stroke-width="1"' if stroke else '')+'/>')
def text(s,x,y,size=16,color='#2C402D',kind='sans'):
 f=fonts[kind];gs=f.getGlyphSet();cmap=f.getBestCmap();upm=f['head'].unitsPerEm;scale=size/upm;cursor=0
 parts.append(f'<g aria-label="{escape(s)}" fill="{color}" transform="translate({x} {y+size}) scale({scale} {-scale})">')
 for ch in s:
  font=f if ord(ch) in cmap else fallback
  glyphs=font.getGlyphSet();name=font.getBestCmap().get(ord(ch),'space');ratio=upm/font['head'].unitsPerEm
  pen=SVGPathPen(glyphs);glyphs[name].draw(pen);d=pen.getCommands()
  if d:parts.append(f'<path transform="translate({cursor} 0) scale({ratio})" d="{d}"/>')
  cursor+=font['hmtx'].metrics[name][0]*ratio
 parts.append('</g>')
def rgb(h):return tuple(int(h[i:i+2],16) for i in (1,3,5))
def mix(a,b,p):return '#'+''.join(f'{round(x*p+y*(1-p)):02X}' for x,y in zip(rgb(a),rgb(b)))
def swatch(name,hex,x,y,w,h,role=None,stroke=False):
 rect(x,y,w,h,hex,'#C7C9C0' if stroke else None)
 r,g,b=rgb(hex)
 def linear(c):
  c=c/255
  return c/12.92 if c<=.04045 else ((c+.055)/1.055)**2.4
 luminance=sum(linear(c)*v for c,v in zip((r,g,b),(.2126,.7152,.0722)))
 ink='#F7F5F0' if luminance<.184 else '#141414'
 text(name,x+16,y+16,14,ink,'mono')
 text(hex,x+16,y+h-62,18,ink,'mono')
 text('RGB '+' / '.join(str(i) for i in rgb(hex)),x+16,y+h-33,14,ink,'mono')
 if role:text(role,x+16,y+49,16,ink)
rect(0,0,1920,1080,'#F7F5F0')
rect(32,32,1856,1,'#2C402D')
text('03',32,52,14,kind='mono')
text('COLOR',352,52,14,kind='mono')
text('PRIMARY PALETTE + SUPPORTING TINTS',352,73,14,kind='mono')
text('MICAH HOANG',1632,52,14,kind='mono')
text('BRAND IDENTITY',1632,73,14,kind='mono')
for title,sub,y in [('Primary palette','The three core colors.',200),('Forest / tints','Six steps. Mixed with cream.',528),('Website neutrals','Exact site token values.',766)]:
 text(title,32,y,24)
 text(sub,32,y+42,15)
for i,(name,h,role) in enumerate([('FOREST GREEN','#2C402D','Brand / primary'),('CREAM','#F7F5F0','Background / primary'),('NEAR BLACK','#141414','Ink / primary')]):
 swatch(name,h,352+i*512,200,512,300,role,stroke=h=='#F7F5F0')
tints=[]
for i,p in enumerate([1,.8,.6,.4,.2,.1]):
 h=mix('#2C402D','#F7F5F0',p);tints.append(h)
 swatch(str(round(p*100))+'%'+(' / BASE' if p==1 else ''),h,352+i*256,528,256,210)
for i,(name,h,role) in enumerate([('NEAR BLACK','#141414','Strong text / rules'),('GRAPHITE','#525252','Body text'),('LIGHT GRAY','#848484','Muted text / strokes')]):
 swatch(name,h,352+i*512,766,512,210,role)
logo=(ROOT/'code/design-system/assets/identity/wordmark-forest-green.svg').read_text()
inner=logo[logo.index('>')+1:logo.rfind('</svg>')].replace('#233324','#2C402D')
parts.append('<g transform="translate(32 1016) scale('+str(256/7682.3)+')">'+inner+'</g>')
text('GREEN TINTS = FOREST + CREAM. SUPPORTING TINT VALUES ARE DERIVED.',352,1014,12,kind='mono')
text('NEUTRALS SOURCED FROM MICAHHOANG.COM / PRIMARY GREEN SPECIFIED FOR THIS IDENTITY.',352,1038,12,kind='mono')
parts.append('</svg>')
(OUT/'micah-hoang-color-palette.svg').write_text(''.join(parts))
print('Created SVG; green tint scale:',', '.join(tints))
