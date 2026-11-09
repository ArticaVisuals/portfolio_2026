from pathlib import Path
from PIL import Image,ImageOps
import json,subprocess,concurrent.futures
B=Path(__file__).parent.parent;R=B/'portfolio-layout-composites';O=B/'media-alignment';U=O/'uploads';U.mkdir(exist_ok=True)
D=json.loads((R/'source-files.json').read_text());IM=json.loads(Path('/Users/micahhoang/My Drive/Portfolio Prep/Portfolio 2026/output/grad-show-2026-11-06/image-manifest.json').read_text());G=json.loads((B/'gif-loops/upload-manifest.json').read_text());GM={v['oldName']:v for v in G}
def src(k):
 for u,v in D.items():
  if k in u or k in Path(v['path']).name:return Path(v['path'])
 for v in IM:
  if k in v['sourceUrl'] or k in v['path']:return Path(v['path'])
 raise KeyError(k)
def probe(p):return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)]))
jobs=[]
def add(old,keys,kind='gif',special=False):
 p=[src(k) for k in keys];g=GM.get(old);oldname=g['name'] if g else old;name=Path(oldname).stem+'-aligned-white.'+('gif' if g else Path(old).suffix[1:]);jobs.append(dict(oldName=oldname,name=name,path=str(U/name),sources=[str(x) for x in p],project=old.split('-')[0],kind=kind,special=special,caption=g['caption'] if g else None,gifSource=g['path'] if g else None))
L=json.loads((R/'source-layouts.json').read_text())['motion-connect-2025']['items'];reel=[v['src'].split('/')[-1] for v in L if v['type']=='video' and v['section']=='Hype Reel'];social=[v['src'].split('/')[-1] for v in L if v['type']=='video' and v['section']=='Social Media']
for n in range(3):add(f'motion-0{n+1}-reel-row-{n+1}.mp4',reel[n*3:n*3+3])
add('motion-04-social-row-1.mp4',social[:4]);add('motion-12-full-social-row-2.mp4',social[4:8]);add('motion-13-full-social-row-3.mp4',social[8:12]);add('motion-10-complete-system-process.mp4',['fB1U','bZzI','1C2a'],special=True);add('motion-11-ai-workflow-demonstrations.mp4',['qCig','WBfS'])
for n,label,keys in [(2,'battery-film-sequences',['HHTk','o0EK']),(3,'process-comparison',['9Z12','7MFl']),(4,'animation-development',['YTha','vkN4'])]:add(f'peak-0{n}-{label}.mp4',keys)
add('simon-01-logo-and-brand-architecture.mp4',['S-S-Logo-Animation','npEW']);add('simon-03-animated-print-applications.mp4',['WTal','Igm5','mNui']);add('cards-05-full-deck-animation.mp4',['8b5X','All-Cards-Animation'])
for old,keys in [('gaia-03-insight.jpg',['DcicrF','rMadio']),('gaia-08-outdoor-campaign.jpg',['HdIg','LX86']),('gaia-09-identity-and-exhibition.jpg',['We8C','cJLz']),('gaia-10-field-notes-and-bioblitz.jpg',['MMcz','nvzH']),('motion-07-print-assets.jpg',['05-motion-connect-2025.jpg','06-motion-connect-2025.jpg'])]:add(old,keys,kind='still')
def run(j):
 dest=Path(j['path']);ps=[Path(x) for x in j['sources']];infos=[probe(p) for p in ps];ratios=[v['streams'][0]['width']/v['streams'][0]['height'] for v in infos];gap=12;h=round((1200-gap*(len(ps)-1))/sum(ratios));ws=[round(r*h) for r in ratios];ws[-1]+=1200-sum(ws)-gap*(len(ps)-1);j['panelSizes']=[[w,h] for w in ws]
 if dest.exists():return j
 if j['kind']=='still':
  canvas=Image.new('RGB',(1200,h),'white');x=0
  for p,w in zip(ps,ws):
   im=ImageOps.exif_transpose(Image.open(p)).convert('RGB').resize((w,h),Image.Resampling.LANCZOS);canvas.paste(im,(x,0));x+=w+gap
  canvas.save(dest,quality=95,subsampling=0);print(dest.name,flush=True);return j
 gi=Image.open(j['gifSource']);duration=sum(gi.seek(f) or gi.info.get('duration',100) for f in range(gi.n_frames))/1000;fps=min(12,round(gi.n_frames/duration,2));colors=192
 if j['special']:
  # Two landscape panels stacked on the left, with a taller type animation on the right.
  h=450;ws=[381,381,800];hs=[215,215,450];positions=['0_0','0_235','400_0'];j['panelSizes']=[[381,215],[381,215],[800,450]]
 else:hs=[h]*len(ps);x=0;positions=[]
 if not j['special']:
  for w in ws:positions.append(f'{x}_0');x+=w+gap
 raw=O/(dest.stem+'.mkv')
 cmd=['ffmpeg','-y','-v','error','-filter_complex_threads','1']
 for p in ps:cmd+=['-stream_loop','-1','-i',str(p)]
 filt=[f'[{i}:v]fps={fps},scale={w}:{hh}:flags=lanczos,setsar=1,setpts=PTS-STARTPTS[v{i}]' for i,(w,hh) in enumerate(zip(ws,hs))]
 filt.append(''.join(f'[v{i}]' for i in range(len(ps)))+'xstack=inputs='+str(len(ps))+':layout='+'|'.join(positions)+':fill=white[out]')
 subprocess.run(cmd+['-filter_complex',';'.join(filt),'-map','[out]','-an','-t',str(duration),'-c:v','ffv1','-threads','2',str(raw)],check=True)
 for fps,colors in [(fps,192),(fps,128),(min(fps,8),96),(6,64)]:
  filt=f'fps={fps},split[a][b];[a]palettegen=max_colors={colors}:reserve_transparent=0:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=3'
  subprocess.run(['ffmpeg','-y','-v','error','-filter_complex_threads','1','-i',str(raw),'-filter_complex',filt,'-loop','0',str(dest)],check=True)
  if dest.stat().st_size<15*1024*1024:break
 assert dest.stat().st_size<15*1024*1024
 raw.unlink();im=Image.open(dest);j.update(bytes=dest.stat().st_size,frames=im.n_frames,width=im.width,height=im.height,duration=duration);assert im.info.get('loop')==0
 print(dest.name,round(dest.stat().st_size/1e6,2),flush=True);return j
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as ex:out=list(ex.map(run,jobs))
(O/'upload-manifest.json').write_text(json.dumps(out,indent=2));print('DONE',len(out),flush=True)
