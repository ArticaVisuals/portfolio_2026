exec((__import__('pathlib').Path(__file__).parent/'rebuild.py').read_text().split('jobs=[]')[0])
backups=json.loads((B/'gif-loops/mp4-backup-manifest.json').read_text());out=[]
for old,keys in [('gaia-12-onboarding-editorial-discovery-map.mp4',['xFNY','kL29','TnTB']),('gaia-13-app-interactions.mp4',['gFR7','vVeK','TNpc']),('cards-06-full-card-demonstrations.mp4',['National-Park-Reel','bAgM','SnapTik'])]:
 ps=[src(k) for k in keys];infos=[probe(p) for p in ps];ratios=[v['streams'][0]['width']/v['streams'][0]['height'] for v in infos];gap=20;h=round((1920-40)/sum(ratios)/2)*2;ws=[round(r*h/2)*2 for r in ratios];ws[-1]+=1920-40-sum(ws);name=Path(old).stem+'-aligned-white.mp4';dest=U/name;backup=B/'gif-loops/mp4-backups'/old.split('-')[0]/old;duration=float(probe(backup)['format']['duration']);cmd=['ffmpeg','-y','-v','error','-filter_complex_threads','1']
 for p in ps:cmd+=['-stream_loop','-1','-i',str(p)]
 filt=[f'[{i}:v]fps=24,scale={w}:{h},setsar=1,setpts=PTS-STARTPTS[v{i}]' for i,w in enumerate(ws)];x=0;pos=[]
 for w in ws:pos.append(f'{x}_0');x+=w+gap
 filt.append('[v0][v1][v2]xstack=inputs=3:layout='+'|'.join(pos)+':fill=white[out]')
 subprocess.run(cmd+['-filter_complex',';'.join(filt),'-map','[out]','-an','-t',str(duration),'-c:v','libx264','-crf','20','-preset','fast','-pix_fmt','yuv420p','-movflags','+faststart','-threads','3',str(dest)],check=True)
 out.append(dict(oldName=old,name=name,path=str(dest),kind='video',project=old.split('-')[0],panelSizes=[[w,h] for w in ws]));print(name,flush=True)
(O/'native-manifest.json').write_text(json.dumps(out,indent=2))
