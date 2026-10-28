const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync('kakeibo.html', 'utf8');
const methods = html.slice(html.indexOf('  async saveTxn() {'), html.indexOf('  setType(type)', html.indexOf('  async saveTxn() {')));
const fields = {txnDate:{value:'2026-01-02'}, txnAmount:{value:'123'}, txnMemo:{value:'synthetic'}};
const rows = new Map(); let fail = false, confirmed = true, toast = '';
const context = {document:{getElementById:id=>fields[id]}, window:{confirm:()=>confirmed}, crypto:{randomUUID:()=> 'synthetic-id'}, db:{transactions:{put:async t=>{if(fail) throw Error('synthetic'); rows.set(t.id, structuredClone(t));}, delete:async id=>{if(fail) throw Error('synthetic'); rows.delete(id);}}}, console:{log(){}}, Number};
const App = vm.runInNewContext(`class App { ${methods} } App`, context);
const app = new App(); app.state={txns:[]}; app.ui={editingId:null,selectedType:'expense',selectedCat:'food'}; app.render=()=>{}; app.closeModal=()=>{}; app.showToast=x=>toast=x;
(async()=>{
 await app.saveTxn(); assert.equal(rows.size,1); assert.equal(rows.get('synthetic-id').amount,123);
 app.state.txns=Array.from(rows.values()); assert.equal(app.state.txns.length,1); // simulated reload
 app.ui.editingId='synthetic-id'; confirmed=false; await app.deleteTxn(); assert.equal(rows.size,1);
 confirmed=true; fail=true; await app.deleteTxn(); assert.equal(rows.size,1); assert.equal(app.state.txns.length,1); assert.match(toast,/失敗/);
 fields.txnAmount.value='456'; await app.saveTxn(); assert.equal(rows.get('synthetic-id').amount,123); assert.equal(app.state.txns[0].amount,123); assert.match(toast,/失敗/);
 fail=false; await app.saveTxn(); assert.equal(rows.get('synthetic-id').amount,456);
 await app.deleteTxn(); assert.equal(rows.size,0); app.state.txns=Array.from(rows.values()); assert.equal(app.state.txns.length,0);
 fields.txnAmount.value='1.5'; app.ui.editingId=null; await app.saveTxn(); assert.equal(rows.size,0);
 console.log('Synthetic transaction save, reload, edit, cancel/delete, failure and validation checks passed');
})().catch(e=>{console.error(e);process.exitCode=1});
