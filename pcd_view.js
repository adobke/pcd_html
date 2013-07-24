var camera, scene, renderer, controls;
var container = document.getElementById('container');

init();
animate();

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

function init() {
    camera = new THREE.PerspectiveCamera( 75, container.offsetWidth / container.offsetHeight, 1, 300 );
    camera.position.z = 15;
    controls = new THREE.OrbitControls( camera );
    controls.addEventListener( 'change', render );

    scene = new THREE.Scene();

    var PI2 = Math.PI * 2;
    var program = function ( context ) {
      context.beginPath();
      context.arc( 0, 0, 1, 0, PI2, true );
      context.fill();
    }

    points = new THREE.Object3D();
    scene.add(points);

    getFile("test.pcd", function(text) {
      if (text === null) {
        console.log("read error");
      } else {
        var lines = text.split("\n");
        for (var i = 0; i < lines.length/4; ++i) {
          coords = lines[i].split(' ');
          particle = new THREE.Particle( new THREE.ParticleCanvasMaterial( { color:  0x808080, program: program } ) );
          particle.position.x = coords[0];
          particle.position.y = coords[1];
          particle.position.z = coords[2];
          particle.scale.x = particle.scale.y = .025;
          points.add( particle );
        }
      }
    });

    renderer = new THREE.CanvasRenderer({ antialias: false });
    renderer.setSize( container.offsetWidth, container.offsetHeight );
    renderer.setClearColor(0x222222, 1);
    container.appendChild(renderer.domElement);
    window.addEventListener( 'resize', onWindowResize, false );
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
