const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const h=fs.readFileSync('kakeibo.html','utf8');
const part=(a,b)=>h.slice(h.indexOf(a),h.indexOf(b,h.indexOf(a)));
const methods=part('  async saveTxn() {','  async deleteTxn()')+part('  exportData() {','  importData()')+part('  async confirmImport() {','  cancelImport()');
let tx=new Map(), settings=new Map(), failure='', downloads=0, toast='', renderFail=false, ids=0;
const fields={txnDate:{value:'2026-01-02'},txnAmount:{value:'123'},txnMemo:{value:'synthetic'},importConfirmOverlay:{classList:{remove(){}}}};
const db={transactions:{put:async t=>{if(failure==='put')throw Error();tx.set(t.id,structuredClone(t))},bulkPut:async ts=>{for(const t of ts)tx.set(t.id,structuredClone(t));if(failure==='bulk')throw Error()},toArray:async()=>{if(failure==='read')throw Error();return [...tx.values()]}},settings:{get:async k=>settings.get(k),put:async x=>{settings.set(x.key,structuredClone(x));if(failure===x.key)throw Error()}},transaction:async(_mode,_t,_s,fn)=>{const beforeT=structuredClone(tx),beforeS=structuredClone(settings);try{await fn()}catch(e){tx=beforeT;settings=beforeS;throw e}}};
const context={db,document:{getElementById:id=>fields[id],createElement:()=>({click(){downloads++}})},crypto:{randomUUID:()=>`id-${++ids}`},URL:{createObjectURL:()=>'',revokeObjectURL(){}},Blob,console:{log(){}},Number,Date};
const App=vm.runInNewContext(`class App {${methods}} App`,context);const app=new App();app.state={txns:[],budgets:{},customCategories:{}};app.ui={editingId:null,selectedType:'expense',selectedCat:'food',pendingImport:null};app.render=()=>{if(renderFail)throw Error()};app.closeModal=()=>{};app.showToast=x=>toast=x;
(async()=>{
 renderFail=true;await app.saveTxn();assert.equal(tx.size,1);assert.match(toast,/保存しましたが/);await app.saveTxn();assert.equal(tx.size,1);assert.equal(ids,1);renderFail=false;
 const original=structuredClone(tx);settings.set('budgets',{key:'budgets',value:{food:10}});
 const input={txns:[{id:'imported',amount:1}],budgets:{food:20},customCategories:{expense:[],income:[]}};
 for(const point of ['bulk','budgets','customCategories','read']){app.ui.pendingImport=input;failure=point;await app.confirmImport();assert.deepEqual(tx,original);assert.equal(settings.get('budgets').value.food,10);assert.equal(settings.has('customCategories'),false);assert.match(toast,/失敗/)}
 failure='';app.ui.pendingImport=input;await app.confirmImport();assert.equal(tx.size,2);assert.equal(settings.get('budgets').value.food,20);assert.ok(settings.has('customCategories'));assert.equal(app.ui.pendingImport,null);
 failure='read';app.exportData();await new Promise(setImmediate);assert.equal(downloads,0);assert.match(toast,/失敗/);
 failure='';app.exportData();await new Promise(setImmediate);assert.equal(downloads,1);
 console.log('PASS: 8 scenarios: committed save display failure and retry; import rollback at three write points and readback; import success; export read failure; export success');
})().catch(e=>{console.error(e);process.exitCode=1});
