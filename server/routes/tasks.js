import {db} from '../config/db.js';
export function taskRoutes(req,res,url){
 if(req.method==='GET'&&url.pathname==='/api/tasks'){return res.json({tasks:db.prepare('SELECT * FROM tasks ORDER BY rowid DESC').all()});}
 const match=url.pathname.match(/^\/api\/tasks\/([^/]+)$/);
 if(req.method==='PATCH'&&match){return req.body.then(body=>{const old=db.prepare('SELECT * FROM tasks WHERE id=?').get(match[1]);if(!old)return res.status(404).json({error:'Task not found'});const status=body.status||old.status;db.prepare('UPDATE tasks SET status=? WHERE id=?').run(status,match[1]);return res.json({task:{...old,status}});});}
 if(req.method==='DELETE'&&match){db.prepare('DELETE FROM tasks WHERE id=?').run(match[1]);return res.json({ok:true});}
 if(req.method==='POST'&&url.pathname==='/api/tasks'){return req.body.then(body=>{const t={id:body.id||crypto.randomUUID(),title:body.title,project:body.project||'',status:body.status||'To Do',priority:body.priority||'Medium',due:body.due||''};db.prepare('INSERT INTO tasks(id,title,project,status,priority,due) VALUES(?,?,?,?,?,?)').run(t.id,t.title,t.project,t.status,t.priority,t.due);return res.json({task:t});});}
 return false;
}
