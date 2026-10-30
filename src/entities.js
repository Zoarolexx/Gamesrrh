import * as THREE from 'three';
const material=c=>new THREE.MeshStandardMaterial({color:c,roughness:1});
export function createPlayer(scene){
 const g=new THREE.Group(),skin=material('#e6ad7d'),shirt=material('#3d7181'),pants=material('#34445c'),dark=material('#292d32');
 const body=new THREE.Mesh(new THREE.BoxGeometry(.8,1.1,.45),shirt);body.position.y=1.25;body.castShadow=true;g.add(body);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.32,8,6),skin);head.position.y=2.05;head.castShadow=true;g.add(head);
 const legs=[];for(let x of [-.22,.22]){let l=new THREE.Mesh(new THREE.BoxGeometry(.25,.8,.3),pants);l.position.set(x,.45,0);l.castShadow=true;g.add(l);legs.push(l)}
 for(let x of [-.52,.52]){let arm=new THREE.Mesh(new THREE.BoxGeometry(.22,.85,.25),skin);arm.position.set(x,1.25,0);arm.rotation.z=x*.3;g.add(arm)}
 const hat=new THREE.Mesh(new THREE.CylinderGeometry(.38,.38,.12,8),dark);hat.position.y=2.35;g.add(hat);
 g.position.set(0,0,14);scene.add(g);return {group:g,legs};
}
export function createAnimal(scene,type,x,z){
 const g=new THREE.Group(),brown=material(type==='cow'?'#eee7d7':type==='boar'?'#80513b':type==='deer'?'#b87943':'#f1eee0'),dark=material('#3a3028'),pink=material('#d88d85');
 const scale=type==='cow'?1.25:type==='chicken'?.55:type==='deer'?.9:1;
 const torso=new THREE.Mesh(new THREE.BoxGeometry(1.1,.75,.62),brown);torso.position.y=.8*scale;torso.scale.setScalar(scale);torso.castShadow=true;g.add(torso);
 const head=new THREE.Mesh(type==='chicken'?new THREE.SphereGeometry(.28,7,6):new THREE.BoxGeometry(.42,.45,.4),brown);head.position.set(.55*scale,1.12*scale,0);head.castShadow=true;g.add(head);
 if(type==='chicken'){const beak=new THREE.Mesh(new THREE.ConeGeometry(.12,.3,4),pink);beak.rotation.z=-Math.PI/2;beak.position.set(.82,.95,0);g.add(beak)}
 for(let x of [-.32,.32])for(let z1 of [-.2,.2]){let leg=new THREE.Mesh(new THREE.BoxGeometry(.13,.55,.13),dark);leg.position.set(x*scale,.3*scale,z1*scale);g.add(leg)}
 if(type==='deer'){for(let s of [-1,1]){let horn=new THREE.Mesh(new THREE.CylinderGeometry(.035,.06,.65,4),dark);horn.position.set(.62,1.55,s*.18);horn.rotation.z=-.3;g.add(horn)}}
 g.position.set(x,0,z);g.userData={type,hp:type==='cow'?5:3,alive:true,roam:Math.random()*6.28};scene.add(g);return g;
}
