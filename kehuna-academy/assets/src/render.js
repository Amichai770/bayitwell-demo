const { chromium } = require('playwright'); const fs=require('fs'); const path=require('path');
const dir=__dirname; const out='/home/user/bayitwell-demo/kehuna-academy/assets';
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(()=>chromium.launch());
  const sky=fs.readFileSync(path.join(dir,'sky.html'),'utf8');
  for (const mode of ['evening','morning']){
    const p=await b.newPage({viewport:{width:2400,height:1350}});
    await p.setContent(sky.replace('MODE',mode)); await p.waitForTimeout(1500);
    await p.screenshot({path:path.join(out,`hero-${mode}.jpg`),type:'jpeg',quality:86}); await p.close();
  }
  const p2=await b.newPage({viewport:{width:1200,height:800}});
  await p2.goto('file://'+path.join(dir,'cards.html')); await p2.waitForTimeout(1800);
  const names=['card-beit-midrash','card-mishmar','card-duchan'];
  for (let i=0;i<3;i++){ const el=await p2.$('#c'+(i+1)); await el.screenshot({path:path.join(out,names[i]+'.jpg'),type:'jpeg',quality:88}); }
  await p2.close();
  fs.copyFileSync(path.join(out,'hero-evening.jpg'),path.join(dir,'hero-evening.jpg'));
  const p3=await b.newPage({viewport:{width:1200,height:630}});
  await p3.goto('file://'+path.join(dir,'og.html')); await p3.waitForTimeout(1800);
  await p3.screenshot({path:path.join(out,'og-mishmeret.jpg'),type:'jpeg',quality:88}); await p3.close();
  await b.close(); console.log('rendered');
})().catch(e=>{console.error(e);process.exit(1);});
