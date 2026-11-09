exec((__import__('pathlib').Path(__file__).parent/'rebuild.py').read_text().split('jobs=[]')[0])
L=json.loads((R/'source-layouts.json').read_text())['weaponized-innocence']['items'];slides=[v for v in L if v['section']=='Interior' and abs(v['width']-1240)<1 and abs(v['y']-3583)<10];fd=O/'publication-frames';fd.mkdir(exist_ok=True)
for n,v in enumerate(slides):
 im=Image.open(src(v['src'].split('/')[-1].split('?')[0])).convert('RGB');im=ImageOps.contain(im,(1920,1280),Image.Resampling.LANCZOS);c=Image.new('RGB',(1920,1280),'white');c.paste(im,((1920-im.width)//2,(1280-im.height)//2));c.save(fd/f'{n:03}.png')
name='weaponized-01-publication-flip-through-white.mp4';dest=U/name
subprocess.run(['ffmpeg','-y','-v','error','-framerate','1/2','-i',str(fd/'%03d.png'),'-c:v','libx264','-preset','fast','-crf','20','-r','24','-pix_fmt','yuv420p','-movflags','+faststart','-threads','3',str(dest)],check=True)
v=dict(oldName='weaponized-01-publication-flip-through.mp4',name=name,path=str(dest),kind='video',project='weaponized');(O/'publication-manifest.json').write_text(json.dumps([v],indent=2));print(name,round(dest.stat().st_size/1e6,2))
