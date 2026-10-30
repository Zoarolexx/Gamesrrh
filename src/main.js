import * as THREE from 'three';
import {createWorld} from './world.js';
import {createPlayer,createAnimal} from './entities.js';
const $=id=>document.getElementById(id);
const scene=new THREE.Scene();scene.background=new THREE.Color('#8bd0dc');scene.fog=new THREE.Fog('#8bd0dc',55,125);
const camera=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,.1,300);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;document.body.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight('#d9f5ff','#647b45',2));
const sun=new THREE.DirectionalLight('#fff1c8',2.4);sun.position.set(-30,55,25);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-65;sun.shadow.camera.right=65;sun.shadow.camera.top=65;sun.shadow.camera.bottom=-65;scene.add(sun);
createWorld(scene);
const player=createPlayer(scene),animals=[];
const animalTypes=['chicken','chicken','chicken','cow','cow','boar','deer','deer'];
for(let i=0;i<animalTypes.length;i++){let a=Math.random()*6.28,r=10+Math.random()*30;animals.push(createAnimal(scene,animalTypes[i],Math.cos(a)*r,Math.sin(a)*r))}
const resources=[],resourceDefs=[['wood','#95613c',0.45],['stone','#858b8c',.48],['fiber','#78a957',.38]];
function addResource(type,x,z){let [_,color,size]=resourceDefs.find(v=>v[0]===type);let mesh=new THREE.Mesh(type==='stone'?new THREE.DodecahedronGeometry(size,0):new THREE.BoxGeometry(size,size*1.5,size),new THREE.MeshStandardMaterial({color}));mesh.position.set(x,size/2,z);mesh.castShadow=true;scene.add(mesh);resources.push({type,mesh,amount:type==='wood'?2:1})}
for(let i=0;i<55;i++){let a=Math.random()*6.28,r=8+Math.random()*37;let x=Math.cos(a)*r,z=Math.sin(a)*r;addResource(['wood','stone','fiber'][i%3],x,z)}
const state={hp:100,food:100,water:100,wood:0,stone:0,fiber:0,meat:0,hide:0,day:1,boat:0};
const keys={};let started=false,clock=new THREE.Clock(),toastTimer;
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),1900)}
function updateUI(){for(let k of ['hp','food','water']){$(k).textContent=Math.ceil(state[k]);$(k+'bar').style.width=state[k]+'%'}$('day').textContent=state.day;
$('inventory').innerHTML=[['🪵','Kayu','wood'],['🪨','Batu','stone'],['🌿','Serat','fiber'],['🥩','Daging','meat']].map(([i,n,k])=>`<div class="slot"><strong>${i} ${state[k]}</strong><span>${n}</span></div>`).join('');
$('objective').textContent=state.boat>=4?'Kapal selesai! Dekati kapal dan tekan E untuk kabur.':`Bangun kapal: kayu ${state.wood}/18 · batu ${state.stone}/6 · serat ${state.fiber}/10 · progres ${state.boat}/4`; }
function distance(a,b){return a.distanceTo(b)}
function nearest(){let p=player.group.position,all=[];resources.forEach(r=>all.push({obj:r,kind:'resource',d:distance(p,r.mesh.position)}));animals.filter(a=>a.userData.alive).forEach(a=>all.push({obj:a,kind:'animal',d:distance(p,a.position)}));return all.sort((a,b)=>a.d-b.d)[0]}
function interact(){let n=nearest();if(!n||n.d>3.5){toast('Tidak ada yang bisa diambil di dekatmu.');return}
if(n.kind==='resource'){state[n.obj.type]+=n.obj.amount;scene.remove(n.obj.mesh);resources.splice(resources.indexOf(n.obj),1);toast(`Mengumpulkan ${n.obj.amount} ${n.obj.type}`)}
else{toast('Hewan liar! Klik untuk berburu.')}updateUI()}
function attack(){let n=nearest();if(!n||n.kind!=='animal'||n.d>3.8){toast('Tidak ada hewan dalam jangkauan.');return}let a=n.obj;a.userData.hp--;a.position.x+=(a.position.x-player.group.position.x)*.18;a.position.z+=(a.position.z-player.group.position.z)*.18;if(a.userData.hp<=0){a.userData.alive=false;scene.remove(a);state.meat+=a.userData.type==='chicken'?1:2;state.hide+=1;toast('Berhasil berburu! +daging, +kulit')}else toast('Serangan mengenai hewan!');updateUI()}
function craft(){const recipes=[{id:'spear',name:'Tombak',desc:'Untuk berburu hewan.',cost:'Kayu 3 + Batu 2',ok:()=>state.wood>=3&&state.stone>=2,run:()=>{state.wood-=3;state.stone-=2;state.spear=true}},{id:'fire',name:'Api unggun',desc:'Memasak daging (fitur lanjutan).',cost:'Kayu 4 + Serat 2',ok:()=>state.wood>=4&&state.fiber>=2,run:()=>{state.wood-=4;state.fiber-=2;state.fire=true}},{id:'boat',name:'Bangun bagian kapal',desc:'Membuat satu bagian kapal. Butuh material.',cost:'Kayu 5 + Serat 3 + Batu 2',ok:()=>state.wood>=5&&state.fiber>=3&&state.stone>=2&&state.boat<4,run:()=>{state.wood-=5;state.fiber-=3;state.stone-=2;state.boat++;}}];
$('recipes').innerHTML=recipes.map(r=>`<div class="recipe"><div><b>${r.name}</b><p>${r.desc}<br>${r.cost}</p></div><button data-recipe="${r.id}" ${r.ok()?'':'disabled'}>BUAT</button></div>`).join('');
$('recipes').querySelectorAll('button').forEach(b=>b.onclick=()=>{let r=recipes.find(x=>x.id===b.dataset.recipe);if(!r.ok())return;r.run();toast(r.id==='boat'?`Bagian kapal ${state.boat}/4 selesai!`:`${r.name} berhasil dibuat!`);craft();updateUI()});
$('craftPanel').classList.remove('hidden')}
$('craftBtn').onclick=craft;$('closeCraft').onclick=()=>$('craftPanel').classList.add('hidden');
function start(){started=true;$('intro').classList.add('hidden');$('hud').classList.remove('hidden');if(innerWidth<800)$('touchControls').classList.remove('hidden');$('loading').remove();updateUI();toast('Kamu terbangun di pantai. Cari bahan untuk bertahan hidup!')}
$('startBtn').onclick=start;
addEventListener('keydown',e=>{keys[e.code]=true;if(e.code==='KeyE'&&started)interact();if(e.code==='KeyC'&&started)craft();if(e.code==='Space'&&started)attack()});
addEventListener('keyup',e=>keys[e.code]=false);addEventListener('mousedown',e=>{if(started&&e.button===0&&!e.target.closest('button')&&!$('craftPanel').contains(e.target))attack()});
document.querySelectorAll('[data-key]').forEach(b=>{let k=b.dataset.key;b.addEventListener('pointerdown',e=>{e.preventDefault();keys[k]=true});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>keys[k]=false))});
$('touchInteract').onclick=interact;$('touchAttack').onclick=attack;
const clock2=new THREE.Clock();let elapsed=0;
function loop(){requestAnimationFrame(loop);let dt=Math.min(clock2.getDelta(),.05);elapsed+=dt;
if(started){state.food=Math.max(0,state.food-dt*.32);state.water=Math.max(0,state.water-dt*.48);if(state.food===0||state.water===0)state.hp=Math.max(0,state.hp-dt*1.2);if(state.hp<=0){toast('Kamu kehabisan tenaga. Segarkan halaman untuk mencoba lagi.');started=false}
let dir=new THREE.Vector3((keys.KeyD?1:0)-(keys.KeyA?1:0),0,(keys.KeyS?1:0)-(keys.KeyW?1:0));if(dir.length()>0){dir.normalize();let speed=(keys.ShiftLeft?9:5)*dt;player.group.position.addScaledVector(dir,speed);player.group.rotation.y=Math.atan2(dir.x,dir.z);player.legs.forEach((l,i)=>l.rotation.x=Math.sin(elapsed*12+i*Math.PI)*.5)}
player.group.position.x=THREE.MathUtils.clamp(player.group.position.x,-46,46);player.group.position.z=THREE.MathUtils.clamp(player.group.position.z,-46,46);
animals.forEach(a=>{if(!a.userData.alive)return;a.userData.roam+=dt*.3;a.position.x+=Math.sin(a.userData.roam)*dt*.5;a.position.z+=Math.cos(a.userData.roam)*dt*.5});
let n=nearest();$('prompt').textContent=n&&n.d<3.5?(n.kind==='resource'?'[E] Ambil '+n.obj.type:'[KLIK] Berburu '+n.obj.userData.type):'';
let target=new THREE.Vector3(player.group.position.x,player.group.position.y+5.2,player.group.position.z+8.5);camera.position.lerp(target,1-Math.pow(.001,dt));camera.lookAt(player.group.position.x,1,player.group.position.z);
if(Math.floor(elapsed/150)+1!==state.day){state.day=Math.floor(elapsed/150)+1;toast('Hari baru dimulai!');}
if(Math.floor(elapsed*2)!==Math.floor((elapsed-dt)*2))updateUI();
}
renderer.render(scene,camera)}
loop();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
