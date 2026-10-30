import * as THREE from 'three';
const mat=(c)=>new THREE.MeshStandardMaterial({color:c,roughness:1});
const make=(g,m,x,y,z,sx=1,sy=1,sz=1)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;o.receiveShadow=true;return o};
export function createWorld(scene){
 const ocean=make(new THREE.PlaneGeometry(500,500,1,1),mat('#3d9eae'),0,-1.2,0,1,1,1);ocean.rotation.x=-Math.PI/2;scene.add(ocean);
 const groundMat=mat('#72a95b'),sand=mat('#e6c78a'),rock=mat('#777d72'),trunk=mat('#8b5934'),leaf=mat('#398653'),leaf2=mat('#5ca85d');
 const island=make(new THREE.CylinderGeometry(47,53,7,12,1),groundMat,0,-2.4,0);scene.add(island);
 const beach=make(new THREE.CylinderGeometry(51,54,1.4,12),sand,0,-1.3,0);scene.add(beach);
 // grassy central plateau
 const hill=make(new THREE.ConeGeometry(27,15,9),groundMat,5,4,-4);scene.add(hill);
 // scattered low-poly trees
 for(let i=0;i<105;i++){let a=Math.random()*Math.PI*2,r=12+Math.random()*34,x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.abs(x)<7&&Math.abs(z)<7)continue;
 const group=new THREE.Group();group.position.set(x,0,z);
 group.add(make(new THREE.CylinderGeometry(.35,.55,3,5),trunk,0,1.5,0));
 const crown=make(new THREE.ConeGeometry(2.2,4,5),i%3?leaf:leaf2,0,4,0);group.add(crown);scene.add(group);}
 // rocks
 for(let i=0;i<32;i++){let a=Math.random()*6.28,r=13+Math.random()*34;let o=make(new THREE.DodecahedronGeometry(.8+Math.random()*1.1,0),rock,Math.cos(a)*r,.2,Math.sin(a)*r);o.rotation.set(Math.random(),Math.random(),Math.random());scene.add(o);}
 // wreckage on beach
 const wreck=new THREE.Group();wreck.position.set(-9,0,10);wreck.rotation.y=.7;
 wreck.add(make(new THREE.BoxGeometry(7,.6,2.6),mat('#765037'),0,.4,0));
 for(let i=0;i<3;i++){let plank=make(new THREE.BoxGeometry(2.5,.25,.4),mat('#9b6841'),-2+i*2,.9,0);plank.rotation.z=.4;wreck.add(plank)}scene.add(wreck);
 // campfire
 const fire=new THREE.Group();fire.position.set(3,0,4);
 for(let i=0;i<3;i++){let log=make(new THREE.CylinderGeometry(.15,.15,2,5),mat('#65402b'),0,.2,0);log.rotation.z=Math.PI/2;log.rotation.y=i*1.05;fire.add(log)}
 const flame=make(new THREE.ConeGeometry(.45,1.4,6),mat('#ff9c35'),0,.9,0);fire.add(flame);scene.add(fire);
 return {wreck,fire};
}
export function createTreeModel(x,z){const g=new THREE.Group();g.position.set(x,0,z);g.add(make(new THREE.CylinderGeometry(.3,.45,2.8,5),mat('#8b5934'),0,1.4,0));g.add(make(new THREE.ConeGeometry(1.8,3.5,5),mat('#398653'),0,3.6,0));return g}
