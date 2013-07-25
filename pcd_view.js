var camera, scene, renderer, controls;
var container = document.getElementById('container');

getFile("test.pcd", function(text) {
  if (text === null) {
    console.log("read error");
  } else {
    init(text);
    animate();
  }
});

function getFile(url,callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = handleStateChange;
  xhr.open("GET", url, true);
  xhr.send();
  function handleStateChange() {
    if (xhr.readyState ===4) {
       callback(xhr.status == 200 ? xhr.responseText: null);  
    }
  }
}

function init(text) {
  camera = new THREE.PerspectiveCamera( 75, container.offsetWidth / container.offsetHeight, 1, 300 );
  camera.position.z = 15;
  controls = new THREE.OrbitControls( camera );
  controls.addEventListener( 'change', render );

  scene = new THREE.Scene();

  geometry = new THREE.Geometry();

  var lines = text.split("\n");
  for (var i = 15; i < lines.length; ++i) {
    coords = lines[i].split(" ");
    var vertex = new THREE.Vector3();
    vertex.x = coords[0];
    vertex.y = coords[1];
    vertex.z = coords[2];
    geometry.vertices.push( vertex );
    geometry.colors.push(new THREE.Color("rgb(255,0,0"));
  }
  console.log("points loaded");
  materials = new THREE.ParticleBasicMaterial( {size: .05, color: "#ff0000"} );
  particles = new THREE.ParticleSystem(geometry, materials);
  scene.add( particles );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( container.offsetWidth, container.offsetHeight );
  renderer.setClearColor(0x222222, 1);
  container.appendChild(renderer.domElement);
  window.addEventListener( 'resize', onWindowResize, false );
  controls.center = new THREE.Vector3(5,-4,0);
}

function onWindowResize() {
  console.log(container.offsetWidth);
  camera.aspect = container.offsetWidth / container.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( container.offsetWidth, container.offsetHeight );
  render();
}

var hack = true;

function animate() {
  if(hack) {
   controls.rotateLeft(.0001); 
   hack = false;
  }
    requestAnimationFrame( animate );
    controls.update();
}

function render() {
  renderer.render(scene,camera);
}
