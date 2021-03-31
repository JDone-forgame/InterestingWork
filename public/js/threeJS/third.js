

function startExample3() {
    var renderer;
    function initThree() {
        width = document.getElementById('canvas-frame').clientWidth;
        height = document.getElementById('canvas-frame').clientHeight;
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setSize(width, height);
        document.getElementById('canvas-frame').appendChild(renderer.domElement);
        renderer.setClearColor('black', 1.0);
    }

    var camera;
    function initCamera() {
        camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        camera.position.x = 0;
        camera.position.y = 1000;
        camera.position.z = 0;
        camera.up.x = 0;
        camera.up.y = 0;
        camera.up.z = 1;
        camera.lookAt({
            x: 0,
            y: 0,
            z: 0
        });
    }

    var scene;
    function initScene() {
        scene = new THREE.Scene();
    }

    var light;
    function initLight() {
        light = new THREE.DirectionalLight(0xFF0000, 1.0, 0);
        light.position.set(100, 100, 200);
        scene.add(light);
    }

    var cube;
    function initObject() {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-500, 0, 0));
        geometry.vertices.push(new THREE.Vector3(500, 0, 0));

        for (var i = 0; i <= 20; i++) {

            // 横着的线，沿着z轴变化复制
            var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 'white', opacity: 1 }));
            line.position.z = (i * 50) - 500;
            scene.add(line);

            // 竖着的线，原本的线绕着y轴转90度，再沿着x轴复制
            var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 'white', opacity: 1 }));
            line.position.x = (i * 50) - 500;
            line.rotation.y = 90 * Math.PI / 180;
            scene.add(line);

        }
    }

    initThree();
    initCamera();
    initScene();
    initLight();
    initObject();
    renderer.clear();
    renderer.render(scene, camera);
}