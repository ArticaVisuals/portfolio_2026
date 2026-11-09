from pathlib import Path
from PIL import Image,ImageDraw
import json
p=Path(__file__).parent;m=json.loads((p/'upload-manifest.json').read_text())
for v in m:
 if v['kind']!='gif':continue
 dest=Path(v['path']);im=Image.open(dest);pal=im.getpalette();pal=pal+[0]*(768-len(pal));pal[765:768]=[255,255,255];palette=Image.new('P',(1,1));palette.putpalette(pal);frames=[];durations=[]
 if v['special']:rects=[(381,0,399,449),(0,215,380,234)]
 else:
  x=0;rects=[]
  for w,h in v['panelSizes'][:-1]:x+=w;rects.append((x,0,x+11,h-1));x+=12
 for n in range(im.n_frames):
  im.seek(n);durations.append(im.info.get('duration',100));f=im.convert('RGB').quantize(palette=palette,dither=Image.Dither.NONE);f.putpalette(pal);d=ImageDraw.Draw(f)
  for r in rects:d.rectangle(r,fill=255)
  frames.append(f)
 tmp=dest.with_suffix('.tmp.gif');frames[0].save(tmp,save_all=True,append_images=frames[1:],duration=durations,loop=0,optimize=True,disposal=1)
 assert tmp.stat().st_size<15*1024*1024,(dest.name,tmp.stat().st_size)
 tmp.replace(dest);v['bytes']=dest.stat().st_size;v['whiteGaps']=rects
 check=Image.open(dest)
 for n in range(check.n_frames):
  check.seek(n)
  for x,y,xx,yy in rects:assert check.convert('RGB').getpixel((x+2,y+2))==(255,255,255)
 print(dest.name,round(dest.stat().st_size/1e6,2),flush=True)
(p/'upload-manifest.json').write_text(json.dumps(m,indent=2))
