import {db} from '../config/db.js';
export function projectRoutes(req,res,url){
 if(req.method==='GET'&&url.pathname==='/api/projects'){const projects=db.prepare('SELECT * FROM projects ORDER BY rowid DESC').all();return res.json({projects});}
 if(req.method==='POST'&&url.pathname==='/api/projects'){return req.body.then(body=>{const p={id:body.id||crypto.randomUUID(),name:body.name,category:body.category||'General',progress:Number(body.progress||0),status:body.status||'Planning',color:body.color||'#6366f1',deadline:body.deadline||''};db.prepare('INSERT INTO projects(id,name,category,progress,status,color,deadline) VALUES(?,?,?,?,?,?,?)').run(p.id,p.name,p.category,p.progress,p.status,p.color,p.deadline);res.json({project:p});});}
 return false;
}
